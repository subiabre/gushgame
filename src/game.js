"use strict";

class PlayerList
{
    constructor()
    {
        this.list = {}
    }
            
    setPlayer(player)
    {
        this.list[player.id] = player
    }

    getPlayer(id)
    {
        return this.list[id]
    }

    removePlayer(player)
    {
        delete this.list[player.id]
    }

    countPlayers()
    {
        let players = Object.keys(this.list).length
        
        return players
    }
}

class Game
{
    constructor()
    {
        this.players = new PlayerList

        this.playersOnAttack = new PlayerList

        this.playersOnDead = new PlayerList
    }
}

module.exports = new Game
