var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Categories = Schema({
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
    }
}, {
    collection: 'categories'
});

mongoose.model('categories', Categories);
