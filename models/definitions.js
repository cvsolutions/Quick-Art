var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Definitions = Schema({
    fullname: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    letter: {
        type: String,
        trim: true,
        required: true
    }
}, {
    collection: 'definitions'
});

mongoose.model('definitions', Definitions);
