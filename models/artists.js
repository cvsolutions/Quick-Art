var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Artists = Schema({
    rid: {
        type: Number,
        trim: true,
        required: true,
        index: {
            unique: true
        }
    },
    fullname: {
        type: String,
        trim: true,
        required: true
    },
    slug: {
        type: String,
        trim: true,
        required: true
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
    biography: {
        type: String,
        trim: true,
        required: true
    },
    reviews: {
        type: String,
        trim: true,
        required: false
    },
    exhibitions: {
        type: String,
        trim: true,
        required: false
    },
    level: Number,
    active: Number,
    registered: Date
}, {
    collection: 'artists'
});

mongoose.model('artists', Artists);
