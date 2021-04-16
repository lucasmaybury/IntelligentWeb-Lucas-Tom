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
        res.status(500).send('error '+ e);
    }
}

exports.insert = function (req, res) {
    let imageData = req.body;
    if (imageData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        const imageFile = new Buffer(imageData.image, 'base64')
        const imagePath = `../private/${imageData.name}.jpg`
        fs.writeFileSync(imagePath, imageFile);

        let image = new Image({name: imageData.name, path: imagePath});

        image.save(function (err, results) {
            console.log(results._id);
        });

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(image));
    } catch (e) {
        res.status(500).send('error '+ e);
    }
}
