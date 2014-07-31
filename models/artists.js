var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Artists = Schema({
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
    phone: {
        type: String,
        trim: true,
        required: false
    },
    usermail: {
        type: String,
        trim: true,
        required: true,
        index: {
            unique: true
        }
    },
    pwd: {
        type: String,
        trim: true,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    web: {
        type: String,
        trim: true,
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
        required: false,
        ref: 'photos'
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    level: Number,
    active: Number,
    registered: Date
}, {
    collection: 'artists'
});

mongoose.model('artists', Artists);
