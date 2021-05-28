/**
 * called whenever a new annotations needs to be added (from the current user, or from another)
 * wrapper to pass an annotation object to database save function
 * @param annotationObject: all information about a single annotation
 * @returns {Promise<void>}
 */
async function cacheAnnotation(annotationObject) {
    storeAnnotationData(annotationObject);
}

/**
 * called upon joining a room
 * repopulates the annotations with those previously saved at an earlier time
 * @param roomId: room name / room ID
 * @returns {Promise<void>}
 */
async function getAnnotationHistory(ctx, roomId) {
    console.log("getting annotation history")
    getRoomAnnotations(roomId).then(annotations => {
        annotations.forEach(annotation => {
            drawOnCanvas(ctx, annotation.w, annotation.h, annotation.x1, annotation.y1, annotation.x2, annotation.y2, color, thickness);
        });
    });

}