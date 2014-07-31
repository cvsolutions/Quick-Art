var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var engine = require('ejs-locals');
var session = require('express-session');

/**
 * Models
 */
require('./models/administrators');
require('./models/regions');
require('./models/provinces');
require('./models/categories');
require('./models/artists');
require('./models/themes');
require('./models/techniques');
require('./models/photos');

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
 * helpers
 * @type {exports}
 */
app.locals.helper = require('native-view-helpers');

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
        return Date.now() + '_' + filename.replace(/\W+/g, '-').toLowerCase()
    }
}));
app.use(session({
    secret: 'Qu1ck-4Rt-2014',
    saveUninitialized: true,
    resave: true
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
    res.status(404).render('site/404', {
        message: 'Sorry, page not found...'
    });
});

app.listen(3000, function () {
    console.log('Quick-Art started...');
});
