exports.init = function(io) {

    /**
     * The message namespace for handling messages between clients
     */
    const chat = io.of("/chat").on("connection", (socket) => {
        try {
            /**
             * it creates or joins a room
             */
            socket.on('create or join', function (room, userId) {
                socket.join(room);
                chat.to(room).emit('joined', room, userId);
            });

            socket.on('chat', (room, userId, chatText) => {
                chat.to(room).emit('chat', room, userId, chatText);
            });

            socket.on('disconnect', function(){
                console.log('someone disconnected');
            });

        } catch (e) {

        }
    });
/*
    // the news namespace
    const news= io
        .of('/news')
        .on('connection', function (socket) {
            try {
                socket.on('create or join', function (room, userId) {
                    socket.join(room);
                    socket.broadcast.to(room).emit('joined', room, userId);
                });

                socket.on('news', function (room, userId, chatText) {
                    socket.broadcast.to(room).emit('news', room, userId, chatText);
                });

                socket.on('disconnect', function () {
                    console.log('someone disconnected');
                });
            } catch (e) {
            }
        });

 */
}