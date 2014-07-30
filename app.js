var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var engine = require('ejs-locals');
var session = require('express-session');

/**
 * Models
 */
require('./models/regions');
require('./models/categories');
require('./models/artists');

/**
 * Connect Mongo DB
 * @type {exports}
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/quick-art');

/**
 * Express
 */
var app = express();

/**
 * set
 */
app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/**
 * use
 */
app.use(express.static(__dirname + '/public'));
app.use(multer({
    dest: './public/uploads/',
    rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase()
    }
}));
app.use(session({
    secret: 'Qu1c4Rt',
    cookie: {
        secure: true
    }
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

/**
 * Routes
 */
app.use('/', require('./routes/site'));
app.use('/administrator', require('./routes/administrator'));
app.use('/extranet', require('./routes/extranet'));

app.use(function (req, res, next) {
    res.status(404).render('404', {
        message: 'Sorry, page not found...'
    });
});

app.listen(3000, function () {
    console.log('Quick-Art started...');
});
