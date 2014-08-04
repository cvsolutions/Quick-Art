var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Articles = Schema({
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
    description: {
        type: String,
        trim: true,
        required: true
    },
    content: {
        type: Schema.Types.ObjectId,
        ref: 'contents'
    },
    tags: {
        type: Object,
        required: false
    },
    active: Number,
    registered: Date
}, {
    collection: 'articles'
});

mongoose.model('articles', Articles);
