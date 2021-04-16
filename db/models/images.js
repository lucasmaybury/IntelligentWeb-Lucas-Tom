const mongoose = require('mongoose');
const fs = require('fs');

const Schema = mongoose.Schema;

const Image = new Schema(
    {
        name: {type: String, required: true},
        path: {type: String, required: true},
    }
);

Image.set('toObject', {getters: true});


let imageModel = mongoose.model('Image', Image);

module.exports = imageModel;
