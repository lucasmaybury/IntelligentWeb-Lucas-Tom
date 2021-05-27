exports.init = function(io) {

    /**
     * The message namespace for handling messages between clients
     */
    const chat = io.of("/chat").on("connection", (socket) => {
        try {
            // creates or joins a room
            socket.on('create or join', function (roomId, userId) {
                socket.join(roomId);
                chat.to(roomId).emit('joined', roomId, userId);
            });

            // sends a chat message to the roomId
            socket.on('chat', (roomId, userId, chatText) => {
                console.log(roomId, userId, chatText)
                chat.to(roomId).emit('chat', roomId, userId, chatText);
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
            socket.on('create or join', function (roomId, userId) {
                socket.join(roomId);
                images.to(roomId).emit('joined', roomId, userId);
            });

            // drawing on canvas
            socket.on('drawing', (roomId, userId, canvasWidth, canvasHeight,
                                  prevX, prevY, currX, currY, color, thickness) => {
                socket.broadcast.to(roomId).emit('drawing', roomId, userId, canvasWidth, canvasHeight,
                                                prevX, prevY, currX, currY, color, thickness);
            });

            // clearing the canvas
            socket.on('clear', (roomId) => {
                socket.broadcast.to(roomId).emit('clear');
            });
        } catch (e) {}
    });

}