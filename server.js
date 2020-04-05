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
    
    // Receive attack
    if (req.body.attacks) {
        event = 'attack'
        player.scaling()

        game.playersOnAttack.setPlayer(player)
    }

    // Process movement
    let moveTo = req.body.position
    let moveFrom = player.position
    
    player.setBoard(req.body.board.width, req.body.board.height)
    player.setPosition(req.body.position.x, req.body.position.y)

    // Detect deaths
    if (game.playersOnAttack.countPlayers() > 0) {
        for (var id in game.playersOnAttack.list) {
            let enemy = game.playersOnAttack.getPlayer(id)

            if (moveTo[enemy.axis] < enemy.position[enemy.axis] && moveFrom[enemy.axis] > enemy.position[enemy.axis] &&
                moveTo[enemy.axis] > enemy.position[enemy.axis] && moveFrom[enemy.axis] < enemy.position[enemy.axis])
                {
                    io.emit('unattack', enemy)
                    game.playersOnAttack.removePlayer(enemy)

                    event = 'death'
                    player.dead = true

                    game.playersOnDead.setPlayer(player)
                }
        }
    }

    // Detect depletions
    if (player.scalation > 2) {
        event = 'depletion'
        player.dead = true

        game.playersOnDead.setPlayer(player)
    }

    // Detect victories
    if (game.players.countPlayers() - game.playersOnDead.countPlayers() === 1) {
        event = 'victory'

        // Revive dead players
        for (var id in game.playersOnDead.list) {
            let rival = game.playersOnDead.getPlayer(id)

            rival.dead = false
            rival.scalation = 0

            game.players.setPlayer(rival)
        }
    }

    io.emit(event, player)
    game.players.setPlayer(player)

    res.send(player)
}) 

var listener = http.listen(process.env.PORT || 4000, () => {
    console.log(`Server listening at http://localhost:${listener.address().port}`)
})
