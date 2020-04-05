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

    if (!player) res.send(false)

    res.send(player)
})

app.post('/player/:id', (req, res) => {
    let player = game.players.getPlayer(req.params.id)

    if (!player) res.send(false)

    player.setBoard(req.body.board.width, req.body.board.height)
    player.setPosition(req.body.position.x, req.body.position.y)

    game.players.setPlayer(player)

    res.send(player)
}) 

var listener = http.listen(process.env.PORT || 4000, () => {
    console.log(`Server listening at http://localhost:${listener.address().port}`)
})
