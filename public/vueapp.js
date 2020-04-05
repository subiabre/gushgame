var app = new Vue({
    el: '#app',

    data: {
        playerWelcome: true,

        board: {width: 0, height: 0},

        position: {x: 0, y: 0}
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
            let cookie = document.cookie.match(/gushPlayer=/)[0]
            
            if (typeof cookie !== undefined) {
                this.id = cookie.replace(/gushPlayer=/, '')

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

            this.position.x = event.clientX
            this.position.y = event.clientY

            return this.position
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
            .then(res => { return res })
        }
    },

    mounted()
    {
        let board = this.getBoardSize()

        console.log(board)
    }
})
