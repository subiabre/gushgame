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

    // Show attacking players to help spawning players
    for (let id in game.playersOnAttack.list) {
        let player = game.playersOnAttack.getPlayer(id)

        io.emit('attack', player)
    }

    res.send(player)
})

app.get('/player/:id', (req, res) => {
    let player = game.players.getPlayer(req.params.id)

    if (!player) return res.send(false)

    res.send(player)
})

app.post('/player/:id', (req, res) => {
    let player = game.players.getPlayer(req.params.id)
    let event = 'movement'

    if (!player) return res.send(false)
    if (player.dead) return res.send(player)

    player.attacks = req.body.attacks
    player.victory = false
    game.playersOnAttack.removePlayer(player)

    // Player attacks
    if (player.attacks) {
        event = 'attack'

        player.scalate()
        
        game.playersOnAttack.setPlayer(player)
        
        player.switchAxis()
    }

    // Player depletes
    if (player.size === 0) {
        event = 'depletion'

        player.dead = true
        player.depleted = true

        game.playersOnDead.setPlayer(player)
    }

    // Player wins
    if (!player.depleted && !player.dead &&
         game.players.countPlayers() > 1 && 
         game.players.countPlayers() - game.playersOnDead.countPlayers() == 1)
    {
        event = 'victory'

        player.victory = true
        player.attacks = false
        player.size += 1

        for (let id in game.playersOnDead.list) {
            let player = game.playersOnDead.getPlayer(id)

            player.dead = false
            player.depleted = false
            player.attacks = false
            player.size = 2

            io.emit('revive', player)

            game.playersOnDead.removePlayer(player)
        }
    }

    // Player crosses an axis
    for (let id in game.playersOnAttack.list) {
        let enemy = game.playersOnAttack.getPlayer(id)
        let axis = enemy.axis
        let to = player.calcPosition(req.body.position.x, req.body.position.y)

        if (!player.spawned && to[axis] > enemy.position[axis] && player.position[axis] < enemy.position[axis] ||
            !player.spawned && to[axis] < enemy.position[axis] && player.position[axis] > enemy.position[axis])
        {
            io.emit('unattack', enemy)

            enemy.attacks = false
            
            game.playersOnAttack.removePlayer(enemy)
            
            event = 'death'

            player.dead = true

            game.playersOnDead.setPlayer(player)
        }
    }

    // Player moves
    player.setBoard(req.body.board.width, req.body.board.height)
    player.setPosition(req.body.position.x, req.body.position.y)
    player.spawned = false

    for (let id in game.players.list) {
        let enemy = game.players.getPlayer(id)
        let random1 = Math.floor(Math.random() * 10)
        let random2 = Math.floor(Math.random() * 10)

        if (enemy.id !== player.id && enemy.size === 0) {

            enemy.dead = true
            enemy.depleted = true

            io.emit('depletion', enemy)

            game.playersOnDead.setPlayer(enemy)
        }

        if (enemy.id !== player.id && random1 === random2) {

            enemy.scalate()
            enemy.attacks = false

            io.emit('unattack', enemy)

            game.playersOnAttack.removePlayer(enemy)
        }
    }

    console.log(event)

    io.emit(event, player)
    game.players.setPlayer(player)

    res.send(player)
}) 

var listener = http.listen(process.env.PORT || 4000, () => {
    console.log(`Server listening at http://localhost:${listener.address().port}`)
})
