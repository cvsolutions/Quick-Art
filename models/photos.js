var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Photos = Schema({
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
    technique: {
        type: Schema.Types.ObjectId,
        ref: 'techniques'
    },
    theme: {
        type: Schema.Types.ObjectId,
        ref: 'themes'
    },
    description: {
        type: String,
        trim: true,
        required: false
    },
    picture: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    metadata: Object,
    height: {
        type: Number,
        trim: true,
        required: false
    },
    width: {
        type: Number,
        trim: true,
        required: true
    },
    depth: {
        type: Number,
        trim: true,
        required: true
    },
    measure: {
        type: String,
        trim: true,
        required: true
    },
    code: {
        type: String,
        trim: true,
        required: false
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    year: {
        type: Number,
        trim: true,
        required: true
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'artists'
    },
    tags: {
        type: Object,
        required: true
    },
    cover: Number,
    available: Number,
    frame: Number,
    registered: Date,
    modification: Date
}, {
    collection: 'photos'
});

mongoose.model('photos', Photos);
