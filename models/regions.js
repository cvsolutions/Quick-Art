var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Regions = Schema({
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
    coordinates: {
        type: Object,
        required: true
    }
}, {
    collection: 'regions'
});

mongoose.model('regions', Regions);
