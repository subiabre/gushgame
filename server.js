const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const http = require('http').createServer(app)
const io = require('socket.io')(http)

const Player = require('./src/player')
const game = require('./src/game')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.post('/player', (req, res) => {
    let player = new Player()

    player.setBoard(req.body.width, req.body.height)
    game.players.setPlayer(player)

    res.send(player)
})

app.get('/player/:id', (req, res) => {
    let player = game.players.getPlayer(req.params.id)

    if (!player) return res.send(false)

    res.send(player)
})

app.post('/player/:id', (req, res) => {
    let player = game.players.getPlayer(req.params.id)
    let event = 'move'

    if (!player || player.dead) return res.send(false) 

    player.attacks = req.body.attacks

    // Player attacks
    if (player.attacks) {
        event = 'attack'

        player.scalate()
        
        game.playersOnAttack.setPlayer(player)
    }

    // Player depletes
    if (player.scaling > 2) {
        event = 'depletion'

        player.dead = true

        game.playersOnDead.setPlayer(player)
    }

    // Player wins
    if (game.players.countPlayers() > 1 && game.players.countPlayers() - game.playersOnDead.countPlayers() == 1) {
        event = 'victory'

        for (let id in game.playersOnDead.list) {
            let player = game.playersOnDead.getPlayer(id)

            player.dead = false

            io.emit('revive', player)

            game.playersOnDead.removePlayer(player)
        }
    }

    // Player moves
    player.setBoard(req.body.board.width, req.body.board.height)
    player.setPosition(req.body.position.x, req.body.position.y)

    console.log(event)

    io.emit(event, player)
    game.players.setPlayer(player)

    res.send(player)
}) 

var listener = http.listen(process.env.PORT || 4000, () => {
    console.log(`Server listening at http://localhost:${listener.address().port}`)
})
