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

        trackPosition(event)
        {
            this.position.x = event.clientX
            this.position.y = event.clientY

            return this.position
        }
    },

    mounted()
    {
        let board = this.getBoardSize()

        console.log(board)
    }
})
