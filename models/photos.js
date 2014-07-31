var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Photos = Schema({
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
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    depth: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
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
