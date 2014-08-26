var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Directories = Schema({
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
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    web: {
        type: String,
        trim: true,
        required: true,
        index: {
            unique: true
        }
    },
    active: Number,
    ip: String,
    registered: Date
}, {
    collection: 'directories'
});

mongoose.model('directories', Directories);
