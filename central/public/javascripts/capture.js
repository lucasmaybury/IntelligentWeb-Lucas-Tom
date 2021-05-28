/**
 * Opens the camera and allows continuous pictures to be taken
 * @returns {Promise<the selected picture in base 64 format}
 */
async function openCamera() {
    // The width and height of the captured photo.
    var width = 300;
    var height = 300;
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera.
    var streamingCamera = false;
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
    var video = null;
    var canvas = null;
    var photo = null;
    var start = null;

    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('camera_Canvas');
        photo = document.getElementById('photo');
        start = document.getElementById('start');

        //Using WebRTC
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });


        video.addEventListener('canplay', function(ev){
            if (!streamingCamera) {
                height = video.videoHeight / (video.videoWidth/width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(height)) {
                    height = width / (4/3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streamingCamera = true;
            }
        }, false);

        start.addEventListener('click', function(ev){
            takepicture();

            ev.preventDefault();
        }, false);
    }

    // Fill the photo with an indication that none has been

    function clear() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('base64');
        photo.setAttribute('src', data);
    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, converting to base64 after.

    function takepicture() {
        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);
            cameraImage = canvas.toDataURL('base64');
            getTakenImage(cameraImage);
        } else {
            clear();
        }
    }

    //event listener to start to process
    window.addEventListener('click', startup, false);

};