"use strict";

const {simpleflake} = require('simpleflakes')

class Player
{
    constructor()
    {
        this.color = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16)})

        let axis = ['x', 'y']
        this.axis = axis[Math.floor(Math.random() * axis.length)]

        this.id = simpleflake().toString(36)

        this.board = {width: 0, height: 0}

        this.position = {x: 0, y: 0}

        this.scaling = 0

        this.dead = false

        this.attacks = false

        this.size = 2
    }

    setBoard(width, height)
    {
        this.board.width = width
        this.board.height = height

        return this.board
    }

    calcPosition(x, y)
    {
        let vw = Math.round(parseFloat(x * 100 / this.board.width))
        let vh = Math.round(parseFloat(y * 100 / this.board.height))

        return {x: vw, y: vh}
    }

    setPosition(x, y)
    {
        let calc = this.calcPosition(x, y)

        this.position.x = calc.x
        this.position.y = calc.y

        return this.position
    }

    scalate()
    {
        this.scaling += 0.16

        this.size -= this.scaling

        return this.scaling
    }

    switchAxis()
    {
        if (this.axis === 'x') this.axis = 'y'
        else this.axis = 'x'
    }
}

module.exports = Player
