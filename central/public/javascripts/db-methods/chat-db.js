/**
 * called whenever socket.io receives a message (from the current user, or from another)
 * this will need to be considered if a socket's behaviour is "broadcast"
 * wrapper to collate relevant data into an object to send to database save function
 * @param roomId: room number / room ID
 * @param userId: user's name / ID
 * @param chatText: text of the chat message
 * @returns {Promise<void>}
 */
async function cacheMessage(roomId, userId, chatText) {
    storeMessageData({
        roomId: roomId,
        userId: userId,
        chatText: chatText,
        dateTime: Date.now()
    });
}

/**
 * called upon joining a room
 * repopulates the chat history with messages previously saved at an earlier time
 * @param roomId: room name / room ID
 * @param userId: user's name / ID
 * @returns {Promise<void>}
 */
async function getEntireChatHistory(roomId, userId) {
    let messages = await getRoomMessages(roomId);
    messages.forEach(message => {
        writeOnChatHistory('<b>' + message.userId + ':</b> ' + message.chatText);
    });
}