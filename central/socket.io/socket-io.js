exports.init = function(io) {

    /**
     * The message namespace for handling messages between clients
     */
    const messages = io.of("/messages").on("connection", (socket) => {
        try {
            // Enroll in a room
            socket.on("enrol", (room, user) => {
                socket.join(room);
                messages.to(room).emit("joined", user);
            });
            // For actually sending message
            socket.on("chat", (room, user, message) => {
                messages.to(room).emit("chat", user, message);
            });
e
            // To show typing animation like on messenger
            socket.on("typing", (room, user) => {
                messages.to(room).emit("typing", room, user);
            })

            // On disconnect
            socket.on("disconnect", () => {
                console.log("User Disconnected")
            });

        } catch (e) {}
    });

    // the news namespace
    const news= io
        .of('/news')
        .on('connection', function (socket) {
            try {
                /**
                 * it creates or joins a room
                 */
                socket.on('create or join', function (room, userId) {
                    socket.join(room);
                    socket.broadcast.to(room).emit('joined', room, userId);
                });

                socket.on('news', function (room, userId, chatText) {
                    socket.broadcast.to(room).emit('news', room, userId, chatText);
                });

                socket.on('disconnect', function(){
                    console.log('someone disconnected');
                });
            } catch (e) {
            }
        });

}