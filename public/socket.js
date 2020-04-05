var socket = io()
var game = document.getElementById('game')

socket.on('movement', (player) => {
    let box = document.getElementById(player.id)

    if (!box) {
        box = document.createElement('div')
        
        box.setAttribute('id', player.id)
        box.setAttribute('class', 'player')

        game.appendChild(box)
    }

    box.setAttribute(
        'style', 
        `width: ${player.size}vw;
         height: ${player.size}vw;
         top: ${player.position.y}vh;
         left: ${player.position.x}vw;
         box-shadow: 0 0 11px ${player.color}`
    )
})

socket.on('attack', (player) => {
    let box = document.getElementById(player.id)

    if (player.axis == 'x') {
        box.setAttribute(
            'style',
            `width: ${100}vw;
             height: ${player.size}vw;
             top: ${player.position.y}vh;
             left: ${0}vw;
             box-shadow: 0 0 11px ${player.color}`
        )
    } else {
        box.setAttribute(
            'style',
            `width: ${player.size}vw;
             height: ${100}vh;
             top: ${0}vh;
             left: ${player.position.x}vw;
             box-shadow: 0 0 22px ${player.color}`
        )
    }
})
