const mongoose = require('mongoose');
const fs = require('fs');

const Schema = mongoose.Schema;

const Image = new Schema(
    {
        name: {type: String, required: true},
        path: {type: String, required: true},
    }
);


Image.virtual('image')
    .get(function () {
        const file = fs.readFileSync(this.path,'base64');
        // const file = fs.readFile(
        //     this.path,'base64', (err,data) => {
        //         if(err) throw err;
        //         return
        //     });
        return file;
    });

Image.set('toObject', {getters: true, virtuals: true});


let imageModel = mongoose.model('Image', Image);

module.exports = imageModel;
