let userId = null;
let roomId = null;
let socket;
let chat = io.connect('/chat');
let cameraImage = null;

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';
    initChatSocket();
    //check for support
    
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        alert('This browser doesn\'t support IndexedDB');
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./serviceWorker.js')
            .then(function() { console.log('Service Worker Registered'); });
    }

    //loadData(false);
}

/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    roomId = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomId;
}

/**
 * it initialises the socket for /chat
 */
function initChatSocket() {
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    chat.on('joined', function (roomId, sender) {
        if (sender === userId) {
            // it enters the chat
            hideLoginInterface(roomId, userId);
            getEntireChatHistory(roomId, userId);
        } else {
            // notifies that someone has joined the room
            writeOnChatHistory('<b>' + userId + '</b>' + ' joined room ' + roomId);
        }
    });
    // called when a message is received
    chat.on('chat', function (roomId, sender, chatText) {
        let who = userId
        if (sender === userId) who = 'Me';
        writeOnChatHistory('<b>' + who + ':</b> ' + chatText); //writes message to screen
        cacheMessage(roomId, userId, chatText); //saves message to indexedDB
    });
}


/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    chat.emit('chat', roomId, userId, chatText);
}

/**
 * used to connect to a room. It gets the userId and room number from the
 * interface
 */
async function connectToRoom() {

    roomId = document.getElementById('roomId').value;
    userId = document.getElementById('userId').value;
    let imageUrl = document.getElementById('image_url').value;
    let imageName = document.getElementById('imageName').value;

    if (!userId) userId = 'Unknown-' + Math.random();

    initCanvas(socket, imageName || imageUrl);
    hideLoginInterface(roomId, userId);
    chat.emit('create or join', roomId, userId);
    images.emit('create or join', roomId, userId);

    getKGHistory(roomId);
}

/**
 * it appends the given html text to the history div
 * @param text: the text to append
 */
function writeOnChatHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}

/**
 * it hides the initial form and shows the chat
 * @param roomId the selected room
 * @param userId the user userId
 */
function hideLoginInterface(roomId, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('initial_form2').style.display = 'none';
    document.getElementById('start').style.display = 'none';
    document.getElementById('camera_button').style.display = 'none';
    document.getElementById('camera_Canvas').style.display = 'none';
    document.getElementById('video').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+roomId;
}

/**
 * It converts image into base64
 * @param image
 * @returns {Promise<base 64 image>}
 */

function base64Image(image){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

/**
 * Receives the taken image from the camera
 * this can then be passed to AJAX request
 * @param image
 */

function getTakenImage(image) {
    cameraImage = image;
}

/**
 * Processes the data from the form which
 * takes or uploads a picture
 * @returns {Promise<any error>}
 */
async function onSubmit(){
    // The .serializeArray() method creates a JavaScript array of objects
    // https://api.jquery.com/serializearray/
    //form data

    const formArray= $("#image-form").serializeArray();
    const data={};
    for (let index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }

    if (cameraImage != null){
        console.log('Saving Camera Image');
        data.image = cameraImage;
    } else {
        //base 64 the image
        console.log('Saving Upload Image')
        var image = document.querySelector('#image').files[0];
        data.image = await base64Image(image)
            .catch(err => {
                console.log(err)
                alert(err)
            })
    }

    // const data = JSON.stringify($(this).serializeArray());
    //console.log(data);
    sendAjaxQuery('/image', data);
    // prevent the form from reloading the page (normal behaviour for forms)
}

/**
 * Performs the Post request to the API
 * @param url
 * @param data
 */

function sendAjaxQuery(url, data) {
    $.ajax({
        url: url ,
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            // in order to have the object printed by alert
            // we need to JSON.stringify the object
            document.getElementById('results').innerHTML= JSON.stringify(dataR);
        },
        error: function (response) {
            // the error structure we passed is in the field responseText
            // it is a string, even if we returned as JSON
            // if you want o unpack it you must do:
            // const dataR= JSON.parse(response.responseText)
            alert (response.responseText);
            console.log(response);
        }
    });
}
