const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const http = require('http').createServer(app)
const io = require('socket.io')(http)

const Player = require('./src/player')
const Game = require('./src/game')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

var listener = http.listen(process.env.PORT || 4000, () => {
    console.log(`Server listening at http://localhost:${listener.address().port}`)
})
