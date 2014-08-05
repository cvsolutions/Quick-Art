var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contents = Schema({
    fullname: {
        type: String,
        trim: true,
        required: true
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        index: {
            unique: true
        }
    },
    show: Number
}, {
    collection: 'contents'
});

mongoose.model('contents', Contents);
