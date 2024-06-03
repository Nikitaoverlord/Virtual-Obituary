const socket = io();

socket.on('give account info', () => {
    socket.emit('initial account info', [localStorage.getItem('email'), localStorage.getItem('password')])
})

socket.on('logged in', ()=>{
    document.querySelector('#logged-in-image').style.display = 'block'
    document.querySelector('#whole-thing').style.display = 'flex'
    document.querySelector('#account-needed').style.display = 'none'
})

socket.on('profile created', (url) => {
    let loc = window.location.href
    window.location.href = loc.substring(0, loc.lastIndexOf('/')) + url
})

socket.on('profile exists', () => {
    console.log('profile exists')
    document.querySelector('#newProfile-form').style.display = 'block'
    document.querySelector('#newProfile-form-part2').style.display = 'none'
    document.querySelector('#newProfile-notePassword').style.display = 'block'
    document.querySelector('#newProfile-audioPassword').style.display = 'block'
    document.querySelector('#profileExistsInfo').textContent = "Profile already exists"
    document.querySelector('#profileExistsInfo').style.color = 'red'
})

var profileName;
var description;
var imageLink;
var private;
var noteLinks = [];
var notePassword = null;
var audioLinks = [];
var audioPassword = null;

document.querySelector('#newProfile-form').addEventListener('submit', (e) => {
    e.preventDefault()

    profileName = document.querySelector('#newProfile-name').value
    description = document.querySelector('#newProfile-description').value
    imageLink = document.querySelector('#newProfile-picture').value
    private = document.querySelector('#newProfile-private').checked

    document.querySelector('#newProfile-form').style.display = 'none'
    document.querySelector('#newProfile-form-part2').style.display = 'block'
})

// document.querySelector('#addMore').addEventListener('click', function(){
//     newNoteLink = document.querySelector('#newProfile-noteLink').value
//     newAudioLink = document.querySelector('#newProfile-audioLink').value

//     if (document.querySelector('#newProfile-notePassword').style.display != 'none'){
//         notePassword = document.querySelector('#newProfile-notePassword').value
//         document.querySelector('#newProfile-notePassword').style.display = 'none'
//     }
//     if (document.querySelector('#newProfile-audioPassword').style.display != 'none'){
//         audioPassword = document.querySelector('#newProfile-audioPassword').value
//         document.querySelector('#newProfile-audioPassword').style.display = 'none'
//     }
    
//     noteLinks.push(newNoteLink)
//     audioLinks.push(newAudioLink)

//     newNoteLink = document.querySelector('#newProfile-noteLink').value = ''
//     newAudioLink = document.querySelector('#newProfile-audioLink').value = ''
// })

document.querySelector('#newProfile-form-part2').addEventListener('submit', (e) => {
    e.preventDefault()

    newNoteLink = document.querySelector('#newProfile-noteLink').value
    notePassword = document.querySelector('#newProfile-notePassword').value
    newAudioLink = document.querySelector('#newProfile-audioLink').value
    audioPassword = document.querySelector('#newProfile-audioPassword').value

    noteLinks.push(newNoteLink)
    audioLinks.push(newAudioLink)

    socket.emit('new profile', [profileName, description, imageLink, private, noteLinks, notePassword, audioLinks, audioPassword])
})