/**
 * this file contains the functions to control the drawing on the canvas
 */
let color = 'red', thickness = 4;
let KGAnnotate = false;

let images = io.connect('/images');

/**
 * it inits the image canvas to draw on. It sets up the events to respond to (click, mouse on, etc.)
 * it is also the place where the data should be sent  via socket.io
 * @param sckt the open socket to register events on
 * @param imageUrl the image url to download
 */
async function initCanvas(sckt, imageUrl) {
    socket = sckt;
    let flag = false,
        prevX, prevY, currX, currY = 0;
    let canvas = $('#canvas');
    let cvx = document.getElementById('canvas');
    let img = document.getElementById('canvas_Image');
    let ctx = cvx.getContext('2d');

    if(imageUrl.includes('http')){
        console.log("setting image from URL")
        img.src = imageUrl;
    } else {
        console.log("setting image from database",imageUrl)
        let dbImage = await fetch('http://localhost:3000/image/' + imageUrl, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
            .then(response => response.json())
            .catch(err => console.error(err))
        img.setAttribute('src', `data:image/jpeg;base64, ${dbImage.image}`)
    }
    // event on the canvas when the mouse is on it
    canvas.on('mousemove mousedown mouseup mouseout', function (e) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.position().left;
        currY = e.clientY - canvas.position().top;
        if (e.type === 'mousedown') {
            flag = true;
        }
        if (e.type === 'mouseup' || e.type === 'mouseout') {
            flag = false;
            color='red';
            document.getElementById("canvas").style.cursor = "auto"
            document.getElementById("query_type").value="";
            document.getElementById("query_input").value="";
            document.getElementById('colour-display').style.backgroundColor = color;
        }
        // if the flag is up, the movement of the mouse draws on the canvas
        if (e.type === 'mousemove') {
            if (flag) {
                drawOnCanvas(ctx, canvas.width, canvas.height, prevX, prevY, currX, currY, color, thickness);
                images.emit('drawing', roomId, canvas.width, canvas.height, prevX, prevY, currX, currY, color, thickness);
            }
        }
    });

    // this is code left in case you need to provide a button clearing the canvas (it is suggested that you implement it)
    $('.canvas-clear').on('click', function (e) {
        console.log("clearing canvas");
        clearCanvas(ctx, canvas);
        images.emit('clear', roomId);
        drawImageScaled(img, cvx, ctx)
    });

    // called when someone else clears the canvas
    images.on('clear', function() {
        clearCanvas(ctx, canvas);
        drawImageScaled(img, cvx, ctx);
    })

    // called when someone else draws on the canvas
    images.on('drawing', function(roomId, canvasWidth, canvasHeight, x1, y1, x2, y2, color, thickness) {
        let ctx = canvas[0].getContext('2d');
        drawOnCanvas(ctx, canvasWidth, canvasHeight, x1, y1, x2, y2, color, thickness);
        cacheAnnotation({roomId: roomId, w:canvasWidth, h:canvasHeight, x1:x1, y1:y1, x2:x2, y2:y2, color: color, thickness: thickness });
    });

    // this is called when the src of the image is loaded
    // this is an async operation as it may take time
    img.addEventListener('load', () => {
        // it takes time before the image size is computed and made available
        // here we wait until the height is set, then we resize the canvas based on the size of the image
        let poll = setInterval(function () {
            if (img.naturalHeight) {
                clearInterval(poll);
                // resize the canvas
                let ratioX=1;
                let ratioY=1;
                // if the screen is smaller than the img size we have to reduce the image to fit
                if (img.clientWidth>window.innerWidth)
                    ratioX=window.innerWidth/img.clientWidth;
                if (img.clientHeight> window.innerHeight)
                    ratioY= img.clientHeight/window.innerHeight;
                let ratio= Math.min(ratioX, ratioY);
                // resize the canvas to fit the screen and the image
                cvx.width = canvas.width = img.clientWidth*ratio;
                cvx.height = canvas.height = img.clientHeight*ratio;
                // draw the image onto the canvas
                drawImageScaled(img, cvx, ctx);
                // hide the image element as it is not needed
                img.style.display = 'none';
            }
            getAnnotationHistory(ctx, roomId);
        }, 10);

    });
}

/**
 * clears the canvas of any marks or annotations
 * @param ctx
 * @param canvas
 */
function clearCanvas(ctx, canvas){
    let c_width = canvas.width;
    let c_height = canvas.height;
    ctx.clearRect(0, 0, c_width, c_height);
}

/**
 * called when it is required to draw the image on the canvas. We have resized the canvas to the same image size
 * so ti is simpler to draw later
 * @param img
 * @param canvas
 * @param ctx
 */
function drawImageScaled(img, canvas, ctx) {
    // get the scale
    let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = (canvas.width / 2) - (img.width / 2) * scale;
    let y = (canvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

/**
 * this is called when we want to display what we (or any other connected via socket.io) draws on the canvas
 * note that as the remote provider can have a different canvas size (e.g. their browser window is larger)
 * we have to know what their canvas size is so to map the coordinates
 * @param ctx the canvas context
 * @param canvasWidth the originating canvas width
 * @param canvasHeight the originating canvas height
 * @param prevX the starting X coordinate
 * @param prevY the starting Y coordinate
 * @param currX the ending X coordinate
 * @param currY the ending Y coordinate
 * @param color of the line
 * @param thickness of the line
 */
function drawOnCanvas(ctx, canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness) {
    //get the ration between the current canvas and the one it has been used to draw on the other computer
    let ratioX= canvas.width/canvasWidth;
    let ratioY= canvas.height/canvasHeight;
    // update the value of the points to draw
    prevX*=ratioX;
    prevY*=ratioY;
    currX*=ratioX;
    currY*=ratioY;
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
    ctx.closePath();
}
