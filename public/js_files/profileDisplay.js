const socket = io();

socket.on('give account info', () => {
    socket.emit('initial account info', [localStorage.getItem('email'), localStorage.getItem('password')])
})

socket.on('logged in', ()=>{
    document.querySelector('#logged-in-image').style.display = 'block'
})

socket.emit('give all profile info')

socket.on('profile info', (profiles) => {
    const holder = document.querySelector("#profileHolder")

    // remove previous profiles
    let child = holder.lastElementChild;
    while (child) {
        holder.removeChild(child);
        child = holder.lastElementChild;
    }

    // Add new profiles
    for (let profileName in profiles){
        prof = profiles[profileName]
        const newDiv = document.createElement('div')
        const newTitle = document.createElement('h1')
        const newImage = document.createElement('img')
        const newLink = document.createElement('a')
        const newLink2 = document.createElement('a')

        const newBlock = document.createElement('div')
        const newDescription = document.createElement('h3')
        const newPrivate = document.createElement('h3')

        newTitle.textContent = profileName
        newImage.src = prof["imageLink"]
        newDescription.textContent = prof["description"]
        newPrivate.textContent = "Private: " + prof["private"]

        let loc = window.location.href
        newLink.href = loc.substring(0, loc.lastIndexOf('/')) + '/profile/' + profileName
        newLink2.href = loc.substring(0, loc.lastIndexOf('/')) + '/profile/' + profileName

        newDiv.classList.add("profileDiv")

        newLink2.append(newTitle)
        newDiv.appendChild(newLink2)
        newLink.appendChild(newImage)
        newDiv.appendChild(newLink)

        newBlock.appendChild(newDescription)
        newBlock.appendChild(newPrivate)

        newDiv.appendChild(newBlock)

        holder.appendChild(newDiv)

    }
    
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

// profileHolder