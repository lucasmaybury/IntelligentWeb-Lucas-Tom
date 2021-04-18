const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Image = new Schema(
    {
        name: {type: String, required: true},
        title: {type: String, required: true},
        description: {type: String, required: true},
        authorName: {type: String, required: true},
    }
);

Image.virtual('path')
    .get(function() {
        return `${appRoot}\\private\\${this.name}.jpg`
    });

Image.set('toObject', {virtuals: true});
Image.set('toJSON', {virtuals: true});

let imageModel = mongoose.model('Image', Image);

module.exports = imageModel;
