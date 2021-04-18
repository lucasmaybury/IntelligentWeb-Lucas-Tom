let Image = require('../models/images');
const path = require('path');
const fs = require('fs');

const getImageData = function(imagePath){
    return new Promise((resolve, reject) => {
    fs.readFile(imagePath,'base64', (err,data) => {
        if(err) reject(err);
        resolve(data)
    });
})}

exports.getByName = function (req, res) {
    let imageName = req.params.name;
    if (imageName == null) {
        res.status(403).send('No data sent!')
    }
    try {
        Image.find({name: imageName},
            'name title description authorName',
            function (err, images) {
                if (err)
                    res.status(500).send('Invalid data!');
                if (images.length>0) {
                    let firstElem = images[0];
                    getImageData(firstElem.path)
                        .then(imageData => {
                            let image = {
                                name: firstElem.name,
                                title: firstElem.title,
                                description : firstElem.description,
                                authorName: firstElem.authorName,
                                image: imageData
                            };
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(image));
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send(err);
                        })
                } else {
                    res.sendStatus(404);
                }
            });
    } catch (e) {
        console.log(err);
        res.status(500).send('error '+ e);
    }
}

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

        Promise.all([fileSave,dbSave ])
            .then(() => {
                res.setHeader('Content-Type', 'application/json');
                res.status(201).send(JSON.stringify(image));
            })
    } catch (err) {
        console.log(err);
        res.status(500).send('error '+ err);
    }
}

let writeFilePromise = (path, file) => new Promise((resolve, reject) => {
    fs.writeFile(path, file, (err) => {
        if(err) reject();
        resolve();
    });
})

