var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Auth = Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    collection: 'auth'
});

mongoose.model('auth', Auth);
