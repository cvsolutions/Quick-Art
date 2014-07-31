var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Provinces = Schema({
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
    }
}, {
    collection: 'provinces'
});

mongoose.model('provinces', Provinces);
