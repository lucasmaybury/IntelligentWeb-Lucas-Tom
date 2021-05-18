function startup(){

    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    }).then(stream => {
        document.getElementById("video").srcObject = stream;
    }).catch(console.error)
}

//window.addEventListener("load", startup, false);