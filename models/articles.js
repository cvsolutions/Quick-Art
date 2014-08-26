var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Articles = Schema({
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
        required: true,
        index: {
            unique: true
        }
    },
    subtitle: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    picture: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    content: {
        type: Schema.Types.ObjectId,
        ref: 'contents'
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'artists'
    },
    tags: {
        type: Object,
        required: true
    },
    year: Number,
    active: Number,
    home: Number,
    registered: Date,
    modification: Date
}, {
    collection: 'articles'
});

mongoose.model('articles', Articles);
