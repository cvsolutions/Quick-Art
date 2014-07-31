var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Techniques = Schema({
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
    collection: 'techniques'
});

mongoose.model('techniques', Techniques);
