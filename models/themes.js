var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Themes = Schema({
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
    collection: 'themes'
});

mongoose.model('themes', Themes);
