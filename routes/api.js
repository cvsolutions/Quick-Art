/**
 * mongoose
 * @type {exports}
 */
var mongoose = require('mongoose');

/**
 * mongoose
 * @type {ObjectId|Types.ObjectId|exports.ObjectId}
 */
var ObjectId = require('mongoose').Types.ObjectId;

/**
 * model
 */
var Artists = mongoose.model('artists');
var Photos = mongoose.model('photos');
var Articles = mongoose.model('articles');
var Directories = mongoose.model('directories');

/**
 * express
 * @type {exports}
 */
var express = require('express');
var router = express.Router();

/**
 * Verifico che l'indirizzo E-mail
 * NON esiste in fase di registrazione
 */
router.post('/check-usermail', function (req, res, next) {
    Artists.findOne({
        usermail: req.body.usermail,
        active: 1
    }).exec(function (err, result) {
        // console.log(result);
        if (err) return next(err);
        if (result) {
            res.status(200).send(false);
        } else {
            res.status(200).send(true);
        }
    });
});

/**
 * Verifico che esiste l'indirizzo Email
 */
router.post('/check-password-usermail', function (req, res, next) {
    Artists.findOne({
        usermail: req.body.usermail,
        active: 1
    }).exec(function (err, result) {
        if (err) return next(err);
        if (result) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    });
});

/**
 * Autocomplete Artists
 */
router.get('/autocomplete/artists', function (req, res, next) {
    var q = req.query.query;
    Artists.find({
        fullname: new RegExp(q, 'i')
    }, 'fullname').exec(function (err, artists) {
        if (err) return next(err);
        // console.log(artists);
        var obj = [];
        for (var i in artists) {
            obj[i] = {};
            obj[i]['value'] = artists[i].fullname;
            obj[i]['data'] = artists[i]._id;
        }
        res.status(200).send({
            query: q,
            suggestions: obj
        });
    });
});

/**
 * Autocomplete Photos
 */
router.get('/autocomplete/photos', function (req, res, next) {
    var q = req.query.query;
    Photos.find({
        fullname: new RegExp(q, 'i')
    }, 'fullname').exec(function (err, photos) {
        if (err) return next(err);
        var obj = [];
        for (var i in photos) {
            obj[i] = {};
            obj[i]['value'] = photos[i].fullname;
            obj[i]['data'] = photos[i]._id;
        }
        res.status(200).send({
            query: q,
            suggestions: obj
        });
    });
});

/**
 * Tutti gli Artisti
 */
router.get('/artists', function (req, res, next) {
    Artists.find({}).populate('category').populate('region').exec(function (err, artists) {
        if (err) return next(err);
        res.status(200).send({
            data: artists
        });
    });
});

/**
 * Tutti gli Articoli
 */
router.get('/articles', function (req, res, next) {
    Articles.find({}).populate('content').populate('artist').exec(function (err, articles) {
        if (err) return next(err);
        res.status(200).send({
            data: articles
        });
    });
});

/**
 * Verifico che NON esiste l'indirizzo E-mail
 * escludento quello dell'Artista stesso
 */
router.post('/check-exclude-usermail', function (req, res) {
    Artists.findOne({
        _id: {
            '$ne': req.body.id
        },
        usermail: req.body.usermail,
        active: 1
    }).exec(function (err, result) {
        if (result) {
            res.status(200).send(false);
        } else {
            res.status(200).send(true);
        }
    });
});

/**
 * Tutte le immagini per ogni Artista
 */
router.get('/gallery/photos', function (req, res, next) {
    Photos.find({
        artist: req.session.passport.user
    }).populate('technique').exec(function (err, photos) {
        if (err) return next(err);
        res.status(200).send({
            data: photos
        });
    });
});

/**
 * Tutti gli Eventi per ogni Artista
 */
router.get('/news/articles', function (req, res, next) {
    Articles.find({
        artist: req.session.passport.user,
        content: new ObjectId('54007362d444cdec9d5de517')
    }).exec(function (err, articles) {
        if (err) return next(err);
        res.status(200).send({
            data: articles
        });
    });
});

/**
 * Verifico che NON esiste un sito web nella directory
 */
router.post('/check-web-directory', function (req, res, next) {
    Directories.findOne({
        web: req.body.web,
        active: 1
    }).exec(function (err, result) {
        if (err) return next(err);
        if (result) {
            res.status(200).send(false);
        } else {
            res.status(200).send(true);
        }
    });
});

/**
 * Tutti i links di Art Directory
 */
router.get('/directories', function (req, res, next) {
    Directories.find({}).populate('category').exec(function (err, articles) {
        if (err) return next(err);
        res.status(200).send({
            data: articles
        });
    });
});

/**
 * Tutti gli Articoli nel Calendario
 */
router.get('/calendar', function (req, res, next) {
    Articles.find({
        active: 1,
        content: new ObjectId('54007362d444cdec9d5de517')
    }).exec(function (err, articles) {
        if (err) return next(err);
        var obj = [];
        for (var i in articles) {
            obj[i] = {};
            obj[i]['title'] = articles[i].fullname;
            obj[i]['url'] = '/blog/' + articles[i].rid + '/' + articles[i].slug;
            obj[i]['start'] = articles[i].registered;
            obj[i]['allDay'] = true;
        }
        res.status(200).send(obj);
    });
});

module.exports = router;
