var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Administrators = Schema({
    fullname: {
        type: String,
        trim: true,
        required: true
    },
    username: {
        type: String,
        trim: true,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        trim: true,
        required: true
    }
}, {
    collection: 'administrators'
});

mongoose.model('administrators', Administrators);
