var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Advertising = Schema({
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
    registered: Date
}, {
    collection: 'advertising'
});

mongoose.model('advertising', Advertising);
