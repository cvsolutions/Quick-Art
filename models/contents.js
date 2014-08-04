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
    }
}, {
    collection: 'contents'
});

mongoose.model('contents', Contents);
