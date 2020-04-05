var app = new Vue({
    el: '#app',

    data: {
        playerWelcome: true,

        board: {width: 0, height: 0},

        position: {x: 0, y: 0},

        id: '',

        player: {}
    },

    methods: {
        getBoardSize()
        {
            this.board.width = this.$refs.app.clientWidth
            this.board.height = this.$refs.app.clientHeight

            return this.board
        },

        getPlayerCookie()
        {
            let cookie = document.cookie.match(/gushPlayer=/)
            
            if (typeof cookie == 'object') {
                this.id = cookie.input.replace(/gushPlayer=/, '')

                return this.id
            }

            return false
        },

        updatePrompt(name, state)
        {
            if (this[name] !== state) this[name] = state
        },

        trackPosition(event)
        {
            this.getBoardSize()
            this.updatePrompt('playerWelcome', false)
            this.trackAttack(event)

            this.position.x = event.clientX
            this.position.y = event.clientY

            this.player.board = this.board
            this.player.position = this.position

            this.postToServer(`player/${this.player.id}`, this.player)

            return this.position
        },

        trackAttack(event)
        {
            let axis = 'client' + this.player.axis.toUpperCase()
            let moveTo = event[axis]
            let moveFrom = this.player.position[this.player.axis]

            // Player attacks
            if (moveTo == moveFrom) this.player.attacks = true
        },

        async postToServer(endpoint, body)
        {
            return fetch(endpoint, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            .then(res => res.json())
            .then(res => {return res})
        },

        async getFromServer(endpoint)
        {
            return fetch(endpoint)
            .then(res => res.json())
            .then(res => {return res})
        }
    },

    async mounted()
    {
        let cookie = this.getPlayerCookie()
        let board = this.getBoardSize()

        let player = cookie ? await this.getFromServer(`player/${cookie}`, {}) : false

        if (!cookie || !player) {
            let player = await this.postToServer('player', board)
            
            this.player = player
            this.id = player.id
            cookie = player.id

            document.cookie = `gushPlayer=${cookie}`

            return
        }

        this.player = player
    }
})
