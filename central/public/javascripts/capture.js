async function camera(){
    navigator.mediaDevices.getUserMedia({
        video: true,
        height: true
    }).then(stream => {
        document.getElementById("video").srcObject = stream;
    }).catch(console.error)

}
var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.canvas.getContext('2d');
var localMediaStream = null;
video.addEventListener('snap', snapshot, false);
navigator.getUserMedia({video: true}, function (stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
});

function snapshot(){
    if(localMediaStream){
        ctx.drawImage(video,0,0, 640, 480);
        document.querySelector('img').src
        = canvas.toDataURL('image/png');
    }
    console.log("successful");
}
/*

document.getElementById('snap'.addEventListener('click', () => {
        ctx.drawImage(video, 0, 0, 640, 480);
        console.log("sick");
    })
)*/