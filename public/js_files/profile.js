const socket = io();

socket.on('give account info', () => {
    socket.emit('initial account info', [localStorage.getItem('email'), localStorage.getItem('password')])
    socket.emit('need info', profileName)
})

socket.on('logged in', ()=>{
    document.querySelector('#logged-in-image').style.display = 'block'
})


var loc = window.location.href
var profileName = loc.substring(loc.lastIndexOf('/')+1, loc.length)
profileName = profileName.replace('%20', ' ')


var profName, description, imageLink;
socket.on('info', (contents) => {
    profName = contents[0], description = contents[1], imageLink = contents[2]

    document.querySelector('#profile-image').src = imageLink
    document.querySelector('#profile-description').textContent = description
    document.querySelector('#profile-name').textContent = profName
})


socket.on('no access private account', () => {
    document.querySelector('#whole-thing').style.display = 'none'
    document.querySelector('#no-access-info').style.display = 'flex'
})

socket.on("account doesn't exist", () => {
    document.querySelector('#profile-name').textContent = "This profile does not exist"
    document.querySelector('#profile-description').textContent = "Log in and create it yourself"
})

socket.on('open note', (url) => {
    window.open(url)
})
socket.on('open audio', (url) => {
    window.open(url)
})
socket.on('wrong audio password', () => {
    document.querySelector('#wrongPasswordInfo').textContent = 'Wrong password'
    document.querySelector('#wrongPasswordInfo').style.color = 'red'
})
socket.on('wrong note password', () => {
    document.querySelector('#wrongPasswordInfo2').textContent = 'Wrong password'
    document.querySelector('#wrongPasswordInfo2').style.color = 'red'
})

document.querySelector('#listen-button').addEventListener('click', function(){
    let password = document.querySelector('#listening-password').value
    socket.emit('request audio', [password, profName])
})

document.querySelector('#note-button').addEventListener('click', function(){
    let password = document.querySelector('#note-password').value
    socket.emit('request note', [password, profileName])
})