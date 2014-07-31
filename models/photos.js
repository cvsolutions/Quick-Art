var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Photos = Schema({
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
    height: {
        type: Number,
        trim: true,
        required: true
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
    price: {
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
        required: false
    },
    cover: Number,
    registered: Date
}, {
    collection: 'photos'
});

mongoose.model('photos', Photos);
