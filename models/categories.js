var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Categories = Schema({
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
    type: {
        type: String,
        trim: true,
        required: true
    }
}, {
    collection: 'categories'
});

mongoose.model('categories', Categories);
