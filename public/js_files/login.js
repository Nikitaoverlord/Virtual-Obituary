const socket = io();

localStorage.setItem('email', 'none')
localStorage.setItem('password', 'none')

socket.on('give account info', () => {
    socket.emit('initial account info', [localStorage.getItem('email'), localStorage.getItem('password')])
})


socket.on('account already exists', ()=>{
    document.querySelector('#accountExists').textContent = "Account already exists"
    document.querySelector('#accountExists').style.color = 'red'
    document.querySelector('#accountExistsInfo').textContent = "Log in or create new account"
})

socket.on('logged in', (contents) =>{
    let email=contents[0], password=contents[1]
    localStorage.setItem('email', email)
    localStorage.setItem('password', password)

    document.querySelector('#login-form').style.display = 'none'
    document.querySelector('#signup-form').style.display = 'none'
    
    document.querySelector('#successDisplay').style.display = 'flex'
    document.querySelector('#successInfo').textContent = 'Logged in!'
})

socket.on('account created', (contents) =>{
    let email=contents[0], password=contents[1]
    localStorage.setItem('email', email)
    localStorage.setItem('password', password)

    document.querySelector('#login-form').style.display = 'none'
    document.querySelector('#signup-form').style.display = 'none'
    
    document.querySelector('#successDisplay').style.display = 'flex'
    document.querySelector('#successInfo').textContent = 'Account Created!'
    document.querySelector('#successInfoInfo').textContent = "(already logged in)"
})

socket.on('log in failed', ()=>{
    document.querySelector('#loginFailed').textContent = 'Log in failed!'
    document.querySelector('#loginFailed').style.color = 'red'
    document.querySelector('#loginFailedInfo').textContent = 'Incorrect password or invalid email!'
  })




document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault()

    let email = document.querySelector('#login-email').value
    let password = document.querySelector('#login-password').value

    socket.emit('log in', [email, password])
})

document.querySelector('#signup-form').addEventListener('submit', (e) => {
    e.preventDefault()

    let email = document.querySelector('#signup-email').value
    let password = document.querySelector('#signup-password').value

    socket.emit('sign up', [email, password])
})