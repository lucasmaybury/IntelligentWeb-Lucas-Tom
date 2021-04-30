let Image = require('../models/images');
const path = require('path');
const fs = require('fs');

/**
 * promise to read data from file
 * @param imagePath: path to image
 * @returns {Promise<image file>}: base64 image string
 */
const getImageData = function(imagePath){
    return new Promise((resolve, reject) => {
    fs.readFile(imagePath,'base64', (err,data) => {
        if(err) reject(err);
        resolve(data)
    });
})}

/**
 * promise to write a base64 image string to the server's private folder
 * @param path: path to save image to
 * @param file: data to write to file
 * @returns {Promise<void>}
 */
let writeFilePromise = (path, file) => new Promise((resolve, reject) => {
    fs.writeFile(path, file, (err) => {
        if(err) reject();
        resolve();
    });
})

/**
 * endpoint to get an image from the database by it's name
 * @param req: request
 * @param res: response
 */
exports.getByName = function (req, res) {
    let imageName = req.params.name;
    if (imageName == null) {
        res.status(403).send('No data sent!')
    }
    try {
        Image.find({name: imageName}, //execute mongoDB query
            'name title description authorName',
            function (err, images) {
                if (err)
                    res.status(500).send('Invalid data!');
                if (images.length>0) { //if any data returned from query
                    let firstElem = images[0]; //query returns a collection, so get the first record
                    getImageData(firstElem.path) //get actual image from private file store
                        .then(imageData => {
                            let image = { //construct image object
                                name: firstElem.name,
                                title: firstElem.title,
                                description : firstElem.description,
                                authorName: firstElem.authorName,
                                image: imageData
                            };
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(image));
                        })
                } else { //if no data returned from query, return "not found"
                    res.sendStatus(404);
                }
            });
    } catch (e) {
        console.error(err);
        res.status(500).send('error '+ e);
    }
}

/**
 * endpoint to facilitate the creation of new image entries
 * @param req: request
 * @param res: response
 * @returns {Promise<void>}
 */
exports.insert = async function (req, res) {
    let imageData = req.body;
    if (imageData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        let image = new Image({
            name: imageData.name,
            title: imageData.title,
            description: imageData.description,
            authorName: imageData.authorName,
        });

        const imageFile = new Buffer.from(imageData.image, 'base64')
        let fileSave = writeFilePromise(image.path, imageFile)
        let dbSave = image.save();

        Promise.all([fileSave,dbSave])
            .then(() => res.status(201).end());

    } catch (err) {
        console.log(err);
        res.status(500).send('error '+ err);
    }
}


// getdata()
//     .then(data => {
//         functionThatMightThrow(data);
//     })
//
//     .catch(error => {
//         // One option (more noisy than console.log):
//         console.error(error);
//         // Another option:
//         notifyUserOfError(error);
//         // Another option:
//         reportErrorToService(error);
//         // OR do all three!
//     });