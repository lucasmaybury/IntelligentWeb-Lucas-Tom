let name = null;
let roomNo = null;
let socket;
let chat = io.connect('/chat');

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
    roomNo = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomNo;
}

/**
 * it initialises the socket for /chat
 */
function initChatSocket() {
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    chat.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            hideLoginInterface(room, userId);
            getEntireChatHistory(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnChatHistory('<b>' + userId + '</b>' + ' joined room ' + room);
        }
    });
    // called when a message is received
    chat.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnChatHistory('<b>' + who + ':</b> ' + chatText); //writes message to screen
        cacheMessage(roomNo, userId, chatText); //saves message to indexedDB
    });
}


/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = $('#chat_input');
    console.log(chatText.value);
    chat.emit('chat', roomNo, name, chatText.value);
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    name = document.getElementById('name').value;
    let imageUrl = document.getElementById('image_url').value;
    if (!name) name = 'Unknown-' + Math.random();

    initCanvas(socket, imageUrl);
    hideLoginInterface(roomNo, name);
    chat.emit('create or join', roomNo, name);
    images.emit('create or join', roomNo, name);
    event.preventDefault();
}

/**
 * it appends the given html text to the history div
 * @param text: the text to append
 */
function writeOnChatHistory(text) {
    console.log("writing chat history from indexedDB")
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('initial_form2').style.display = 'none';
    document.getElementById('start').style.display = 'none';
    document.getElementById('camera_button').style.display = 'none';
    document.getElementById('camera_Canvas').style.display = 'none';
    document.getElementById('video').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}

function base64Image(image){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
//ajax
function onSubmit(){
    // The .serializeArray() method creates a JavaScript array of objects
    // https://api.jquery.com/serializearray/
    //base 64 the image
    var image = document.querySelector('#image').files[0];
    base64Image(image)
        .then(data => console.log(data))
        .catch(err => alert(err))
    const formArray= $("#image-form").serializeArray();
    const data={};
    for (let index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    // const data = JSON.stringify($(this).serializeArray());
    console.log(data);
    sendAjaxQuery('/image', data);
    // prevent the form from reloading the page (normal behaviour for forms)
    event.preventDefault();

}

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
