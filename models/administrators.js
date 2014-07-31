var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Administrators = Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    }
}, {
    collection: 'administrators'
});

mongoose.model('administrators', Administrators);
