/**
 * called whenever a new annotations needs to be added (from the current user, or from another)
 * wrapper to pass an annotation object to database save function
 * @param annotationObject: all information about a single annotation
 * @returns {Promise<void>}
 */
async function cacheKG(roomId, color, content) {
    storeKGData({roomId: roomId, color: color, content: content});
}

/**
 * called upon joining a room
 * repopulates the annotations with those previously saved at an earlier time
 * @param roomId: room name / room ID
 * @returns {Promise<void>}
 */
async function getKGHistory(roomId) {
    console.log("getting annotation history")
    getRoomKGs(roomId).then(entries => {
        entries.forEach(entry => {
            console.log("getting: " + JSON.stringify(entry))
            addKGEntry(entry.content, entry.color);
        });
    });

}