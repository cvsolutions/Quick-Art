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
    phone: {
        type: String,
        required: false
    },
    usermail: {
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
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    web: {
        type: String,
        required: false
    },
    region: {
        type: Schema.Types.ObjectId,
        ref: 'regions'
    },
    province: {
        type: Schema.Types.ObjectId,
        ref: 'provinces'
    },
    photo: {
        type: Schema.Types.ObjectId,
        ref: 'photos'
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
