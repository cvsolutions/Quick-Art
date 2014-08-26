var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Advertising = Schema({
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
    description: {
        type: String,
        trim: true,
        required: false
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    region: {
        type: Schema.Types.ObjectId,
        ref: 'regions'
    },
    picture: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    views: Number,
    active: Number,
    ip: String,
    registered: Date
}, {
    collection: 'advertising'
});

mongoose.model('advertising', Advertising);
