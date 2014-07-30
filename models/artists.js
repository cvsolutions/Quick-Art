var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Artists = Schema({
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
    pwd: {
        type: String,
        required: true
    },
    usermail: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    region: {
        type: Schema.Types.ObjectId,
        ref: 'regions'
    },
    web: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    level: Number,
    active: Number,
    registered: Date
}, {
    collection: 'artists'
});

mongoose.model('artists', Artists);
