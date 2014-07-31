var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Themes = Schema({
    fullname: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    coordinates: {
        type: Object,
        required: true
    }
}, {
    collection: 'themes'
});

mongoose.model('themes', Themes);
