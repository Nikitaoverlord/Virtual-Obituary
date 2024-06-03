const socket = io();

socket.on('give account info', () => {
    socket.emit('initial account info', [localStorage.getItem('email'), localStorage.getItem('password')])
})

socket.on('logged in', ()=>{
    document.querySelector('#logged-in-image').style.display = 'block'
})

socket.on('search results', (results) => {
    const search = document.querySelector("#searchDiv")

    // remove previous terms
    let child = search.lastElementChild;
    while (child) {
        search.removeChild(child);
        child = search.lastElementChild;
    }
    // Add new terms
    results.forEach((result) => {
        const newTerm = document.createElement('a')
        const newButton = document.createElement('button')

        newButton.classList.add("searchButton")
        newButton.textContent = result

        let loc = window.location.href
        newTerm.href = loc.substring(0, loc.lastIndexOf('/')) + '/profile/' + result

        newTerm.appendChild(newButton)
        search.appendChild(newTerm)
    })

})

document.querySelector('#lookup').addEventListener('click', function(){
    let name = document.querySelector('#name-tag').value
    socket.emit('look up name', name)
})