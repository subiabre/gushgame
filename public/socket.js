var socket = io()

socket.on('move', (player) => {
    console.log('move')
    console.log(player)
})
