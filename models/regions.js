var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Regions = Schema({
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
    coordinates: {
        type: Object,
        required: true
    }
}, {
    collection: 'regions'
});

mongoose.model('regions', Regions);
