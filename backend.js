const fs = require('fs')

const Fuse = require('fuse.js')

const express = require("express")
const app = express()

// socket.io setup
const http = require("http")
const server = http.createServer(app)
const { Server } = require('socket.io')
const { profile } = require('console')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })

const port = 3002

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html_files/index.html')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/html_files/login.html')
})

app.get('/new-profile', (req, res) => {
    res.sendFile(__dirname + '/public/html_files/new_profile.html')
})

app.get('/profile/:profileName', (req, res) => {
    res.sendFile(__dirname + '/public/html_files/profile.html')
})

app.get('/info', (req, res) => {
    res.sendFile(__dirname + '/public/html_files/info.html')
})

app.get('/share', (req, res) => {
    res.sendFile(__dirname + '/public/html_files/share.html')
})

app.get('/profileDisplay', (req, res) => {
    res.sendFile(__dirname + '/public/html_files/profileDisplay.html')
})


const users = {} // a dictionary of objects with each key being the socket.id


// reading JSON data
var accountInfo = JSON.parse(fs.readFileSync(__dirname + '/public/data/accounts.json'))
var profiles = JSON.parse(fs.readFileSync(__dirname + '/public/data/profiles.json')) 



io.on('connection', (socket) => {
    console.log('a user connected')
    users[socket.id] = {loggedIn: false, email: null}

    io.to(socket.id).emit('give account info')

    socket.on('disconnect', (reason) => {
        console.log(reason)
        delete users[socket.id]
    })

    socket.on('initial account info', (contents) => {
        let email = contents[0], password = contents[1]
        if (email in accountInfo && accountInfo[email]["password"] == password){
            users[socket.id].loggedIn = true;
            users[socket.id].email = email

            io.to(socket.id).emit('logged in')
        }
    })

    socket.on('log in', (contents) => {
        let email = contents[0], password = contents[1]
        if (email in accountInfo && accountInfo[email]["password"] == password){
            io.to(socket.id).emit('logged in', [email, password])
            users[socket.id].loggedIn = true;
            users[socket.id].email = email
        }
        else { io.to(socket.id).emit('log in failed') }
    })

    socket.on('sign up', (contents) => {
        let email = contents[0], password = contents[1]
        if (email in accountInfo){ io.to(socket.id).emit('account already exists') }
        else{
            accountInfo[email] = {password: password}
            io.to(socket.id).emit('account created', [email, password])
        }
    })

    socket.on('new profile', (contents) => {
        if (users[socket.id].loggedIn){
            let profileName=contents[0], description=contents[1], imageLink=contents[2], private=contents[3], 
            noteLinks=contents[4], notePassword=contents[5], audioLinks=contents[6], audioPassword=contents[7]
    
            if (profileName in profiles) { io.to(socket.id).emit('profile exists') }
            else {//// "name": {"descrption":"url", "image":"", "private":false/true, "note":"url", etc.}
                profiles[profileName] = {"description": description, "imageLink": imageLink, "private": private, "noteLinks":noteLinks, 
                    "notePassword": notePassword, "audioLinks": audioLinks, "audioPassword": audioPassword, "owner": users[socket.id].email
                }
                io.to(socket.id).emit('profile created', ('/profile/' + profileName))
            }
        }
    })

    socket.on('need info', (profileName) => {
        if (profileName in profiles){
            var prof = profiles[profileName]
            if ((prof["private"] && users[socket.id].loggedIn && users[socket.id].email == prof["owner"])){
                io.to(socket.id).emit('info', [profileName, prof["description"], prof["imageLink"]])
            }
            else if (!prof["private"]) {
                io.to(socket.id).emit('info', [profileName, prof["description"], prof["imageLink"]])
            }
            else {
                io.to(socket.id).emit('no access private account')
            }
        }
        else {
            io.to(socket.id).emit("account doesn't exist")
        }
    })

    socket.on('request audio', (contents) => {
        let password = contents[0], profileName = contents[1]
        if (profileName in profiles){
            if (password == profiles[profileName]["audioPassword"]){
                io.to(socket.id).emit('open audio', profiles[profileName]["audioLinks"][0])
            }
            else io.to(socket.id).emit('wrong audio password') 
        }
        
    })
    socket.on('request note', (contents) => {
        let password = contents[0], profileName = contents[1]
        if (profileName in profiles){
            if (password == profiles[profileName]["notePassword"]){
                io.to(socket.id).emit('open note', profiles[profileName]["noteLinks"][0])
            }
            else io.to(socket.id).emit('wrong note password')
        }
    })

    socket.on('look up name', (name) => {
        let listOfNames = Object.keys(profiles)
        let options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            includeScore: true
            // don't include the keys property
          };
        const fuse = new Fuse(listOfNames, options)
        let result = fuse.search(name);
        
        let parsedResults = []
        result.forEach((result) => {
            parsedResults.push(result["item"])
        })

        io.to(socket.id).emit('search results', (parsedResults))
    })

    socket.on('give all profile info', () => {
        let parsedProfiles = {}
        for (let profile in profiles) {
            parsedProfiles[profile] = {"description": profiles[profile]["description"], "imageLink": profiles[profile]["imageLink"], "private": profiles[profile]["private"]}
        }
        io.to(socket.id).emit('profile info', parsedProfiles)
    })
})



setInterval(() => {
    // updating data
    fs.writeFileSync(__dirname + '/public/data/accounts.json', JSON.stringify(accountInfo))
    fs.writeFileSync(__dirname + '/public/data/profiles.json', JSON.stringify(profiles))
    ////////////////
}, 15)




server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
  
console.log('server did load')