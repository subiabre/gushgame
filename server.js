const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

var listener = http.listen(8080, () => {
    console.log(`Server listening at http://localhost:${listener.address().port}`)
})
