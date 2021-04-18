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

    /**
     * The images namespace for handling drawing and canvas activities betweeen clients
     */
    const images = io.of("/images").on("connection",  (socket) => {
        try {
            // Enroll in a room
            socket.on("enrol", (room) => {
                socket.join(room);
            });
            // Drawing on canvas
            socket.on("drawing", (room, user, canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness) => {
                images.to(room).emit("draw", user, canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness);
            });
            // Clearing the canvas
            socket.on("clear", (room, user) => {
                images.to(room).emit("clear", user);
            });
        } catch (e) {}
    });

}