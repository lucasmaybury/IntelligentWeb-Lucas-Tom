const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/images';

mongoose.Promise = global.Promise;

try {
    connection = mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        checkServerIdentity: false,
    });
    console.log('connection to mongodb established');
} catch (e) {
    console.log('error in db connection: ' + e.message);
}