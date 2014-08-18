var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var engine = require('ejs-locals');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

/**
 * Models
 */
require('./models/administrators');
require('./models/contents');
require('./models/articles');
require('./models/regions');
require('./models/provinces');
require('./models/categories');
require('./models/artists');
require('./models/themes');
require('./models/techniques');
require('./models/photos');
require('./models/definitions');
require('./models/advertising');

/**
 * Connect Mongo DB
 * @type {exports}
 */
mongoose.connect('mongodb://127.0.0.1:27017/quick-art');

/**
 * Model
 */
var Administrators = mongoose.model('administrators');
var Artists = mongoose.model('artists');

/**
 * Express
 */
var app = express();

/**
 * helpers
 * @type {exports}
 */
app.locals.helper = require('native-view-helpers');
app.locals.truncate = require('html-truncate');
app.locals.gravatar = require('gravatar');

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

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(session({
    secret: 'Qu1ck-4Rt-2014',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

/**
 * Passport
 */
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Administrators.findById(id, function (err, user) {
        if (err) done(err);
        if (user) {
            done(null, user);
        } else {
            Artists.findById(id, function (err, user) {
                if (err) done(err);
                done(null, user);
            });
        }
    });
});

passport.use('administrator-local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        Administrators.findOne({
            username: email,
            password: password
        }, function (err, user) {
            if (err) return done(err);
            if (!user) return done(null, false);
            return done(null, user);
        });
    }));

passport.use('extranet-local', new LocalStrategy({
        usernameField: 'usermail',
        passwordField: 'pwd',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        Artists.findOne({
            usermail: email,
            pwd: password,
            active: 1
        }, function (err, user) {
            if (err) return done(err);
            if (!user) return done(null, false);
            return done(null, user);
        });
    }));

/**
 * Routes
 */
app.use('/', require('./routes/site'));
app.use('/blog', require('./routes/blog'));
app.use('/administrator', require('./routes/administrator'));
app.use('/extranet', require('./routes/extranet'));
app.use('/api', require('./routes/api'));

/**
 * 404 Error
 */
app.use(function (req, res) {
    res.status(404).render('site/404', {});
});

app.listen(3010, function () {
    console.log('Quick-Art started...');
});
