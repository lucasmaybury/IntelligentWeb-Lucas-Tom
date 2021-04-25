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
    let chatText = document.getElementById('chat_input').value;
    chat.emit('chat', roomNo, name, chatText);
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    name = document.getElementById('name').value;
    let imageUrl= document.getElementById('image_url').value;
    if (!name) name = 'Unknown-' + Math.random();
    //@todo join the room
    initCanvas(socket, imageUrl);
    hideLoginInterface(imageUrl, name);
    chat.emit('create or join', roomNo, name);
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
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('initial_form2').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}

/**
 * called whenever socket.io receives a message (from the current user, or from another)
 * this will need to be considered if a socket's behaviour is "broadcast"
 * wrapper to collate relevant data into an object to send to database save function
 * @param roomNo: room number / room ID
 * @param userId: user's name / ID
 * @param chatText: text of the chat message
 * @returns {Promise<void>}
 */
async function cacheMessage(roomNo, userId, chatText) {
    storeMessageData({
        roomNo: roomNo,
        userId: userId,
        chatText: chatText,
        dateTime: Date.now()
    });
}

/**
 * called upon joining a room
 * repopulates the chat history with messages previously saved at an earlier time
 * @param room: room name / room ID
 * @param userId: user's name / ID
 * @returns {Promise<void>}
 */
async function getEntireChatHistory(room, userId) {
    let messages = await getRoomMessages(room);
    messages.forEach(message => {
        writeOnChatHistory('<b>' + message.userId + ':</b> ' + message.chatText);
    });
}

// get web cam function

async function getWebCam(){
    try{
        const videoSrc = await navigator.mediaDevices.getUserMedia({video:true});
        var video = document.getElementById("video");
        video.srcObject = videoSrc;
    }catch(e){
        console.log(e);
    }
}
