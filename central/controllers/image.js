const fetch = require('node-fetch');

/**
 * endpoint that receives a name of a requested image and it's metadata, and fetches the image from the database server
 * @param req: contains 'name' parameter
 * @param res
 * responds with an image object from the database
 */
exports.sendImageToClient = function (req, res) {
    let headers = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        userAgent: 'localhost:3000'
    }

    fetch(`http://localhost:3001/${req.params.name}`, headers) //make the call to the database server
        .then(response => response.json())
        .then(image => res.send(image)) //return image data to browser
        .catch(err => {
            console.log(err);
            if (err.status === 404) {
                res.sendStatus(404) //common error
            } else {
                res.render("error", {error: err, message: err}) //for all other errors
            }
        });
}

/**
 * endpoint that accepts image data from the browser,
 * and sends a request to the database server to save it into the database
 * @param req:
 * {
     name: string,
     title: string,
     description: string,
     authorName: string,
     image: string - base64 image
   }
 * @param res
 * responds with a 201 code on success, or an error
 */
exports.saveImageToDB = function (req, res) {
    let headers = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        userAgent: 'localhost:3000',
        body: JSON.stringify(req.body) //pass body through to database server from client
    }
    console.log(req.body)
    fetch(`http://localhost:3001`, headers)//make the request
        .then(response => {
            if(response.status !== 201) { throw new Error('error saving to database') } //forces program into catch block below
            console.log('saving image')
            res.status(201).end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).render("error", {error: err, message: err});
        });

}


