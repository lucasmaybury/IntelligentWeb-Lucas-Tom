let Image = require('../models/images');
const fs = require('fs');

const getImageData = function(path){
    return new Promise((resolve, reject) => {
    fs.readFile(path,'base64', (err,data) => {
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
            'name path image',
            function (err, images) {
                if (err)
                    res.status(500).send('Invalid data!');
                let image =null;
                if (images.length>0) {
                    let firstElem = images[0];
                    image = {
                        name: firstElem.name,
                        path: firstElem.path
                    };
                    getImageData(image.path)
                        .then((imageData)=>{
                            image.image = imageData;
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(image));
                        })
                        .catch(err => {
                            console.log(err);
                            res.send(err);
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
