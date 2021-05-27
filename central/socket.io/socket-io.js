exports.init = function(io) {

    /**
     * The message namespace for handling messages between clients
     */
    const chat = io.of("/chat").on("connection", (socket) => {
        try {
            // creates or joins a room
            socket.on('create or join', function (room, userId) {
                socket.join(room);
                chat.to(room).emit('joined', room, userId);
            });

            // sends a chat message to the room
            socket.on('chat', (room, userId, chatText) => {
                console.log(room, userId, chatText)
                chat.to(room).emit('chat', room, userId, chatText);
            });

            // disconnects from a room
            socket.on('disconnect', function(){
                console.log('someone disconnected');
            });
        } catch (e) { }
    });

    /**
     * The images namespace for handling drawing and canvas activities between clients
     */
    const images = io.of("/images").on("connection", (socket) => {
        try {
            // creates or joins a room
            socket.on('create or join', function (room, userId) {
                socket.join(room);
                images.to(room).emit('joined', room, userId);
            });

            // drawing on canvas
            socket.on('drawing', (room, userId, canvasWidth, canvasHeight,
                                  prevX, prevY, currX, currY, color, thickness) => {
                images.to(room).emit('drawing', room, userId, canvasWidth, canvasHeight,
                                                prevX, prevY, currX, currY, color, thickness);
            });

            // clearing the canvas
            socket.on('clear', (room) => {
                images.to(room).emit('clear');
            });
        } catch (e) {}
    });

}