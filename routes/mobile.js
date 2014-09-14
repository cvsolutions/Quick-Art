/**
 * mongoose
 * @type {exports}
 */
var mongoose = require('mongoose');

/**
 * ObjectId
 * @type {ObjectId|Types.ObjectId|exports.ObjectId}
 */
var ObjectId = require('mongoose').Types.ObjectId;

/**
 * model
 */
var Artists = mongoose.model('artists');
var Photos = mongoose.model('photos');
var Categories = mongoose.model('categories');
var Articles = mongoose.model('articles');
var Techniques = mongoose.model('techniques');
var Themes = mongoose.model('themes');

/**
 * express
 * @type {exports}
 */
var express = require('express');
var router = express.Router();

/**
 * Home Mobile
 */
router.get('/', function (req, res, next) {
    Artists.find({
        active: 1
    }).populate('category').populate('region').populate('photo').sort({
        registered: 'desc'
    }).limit(10).exec(function (err, artists) {
        if (err) return next(err);
        Photos.find({
            cover: 1
        }).sort({
            registered: 'desc'
        }).limit(10).exec(function (err, photos) {
            if (err) return next(err);
            res.render('mobile/index', {
                artists: artists,
                photos: photos
            });
        });
    });
});

/**
 * Tutte le Categorie
 */
router.get('/categories', function (req, res, next) {
    Categories.find({
        type: 'gallery'
    }).sort({
        fullname: 'asc'
    }).exec(function (err, categories) {
        if (err) return next(err);
        res.render('mobile/categories', {
            categories: categories
        });
    });
});

/**
 * Artisti per Categoria
 */
router.get('/category/:slug', function (req, res, next) {
    Categories.findOne({
        slug: req.param('slug'),
        type: 'gallery'
    }).exec(function (err, category) {
        if (err) return next(err);
        Artists.find({
            category: category._id,
            active: 1
        }).populate('region').populate('photo').sort({
            registered: 'desc'
        }).exec(function (err, artists) {
            if (err) return next(err);
            res.render('mobile/category', {
                category: category,
                artists: artists
            });
        });
    });
});

/**
 * Dettaglio Artista
 */
router.get('/artist/:rid', function (req, res, next) {
    Artists.findOne({
        rid: req.param('rid'),
        active: 1
    }).populate('category').populate('region').populate('province').exec(function (err, artist) {
        if (err) return next(err);
        Photos.find({
            artist: artist._id
        }).populate('technique').sort({
            fullname: 'asc'
        }).exec(function (err, photos) {
            if (err) return next(err);
            res.render('mobile/artist', {
                artist: artist,
                photos: photos
            });
        });
    });
});

/**
 * Catalogo Opere d'Arte
 */
router.get('/themes', function (req, res, next) {
    Themes.find({}).sort({
        fullname: 'asc'
    }).exec(function (err, themes) {
        if (err) return next(err);
        res.render('mobile/themes', {
            themes: themes
        });
    });
});

/**
 * Tutte le Opere in base alla Categoria Tematica
 */
router.get('/theme/:slug', function (req, res, next) {
    Themes.findOne({
        slug: req.param('slug'),
    }).exec(function (err, theme) {
        if (err) return next(err);
        Photos.find({
            theme: theme._id
        }).populate('technique').exec(function (err, photos) {
            if (err) return next(err);
            res.render('mobile/theme', {
                theme: theme,
                photos: photos
            });
        });
    });
});

/**
 * Tutti gli Eventi
 */
router.get('/events', function (req, res, next) {
    Articles.find({
        content: new ObjectId('54007362d444cdec9d5de517'),
        active: 1
    }).sort({
        registered: 'desc'
    }).exec(function (err, articles) {
        if (err) return next(err);
        res.render('mobile/events', {
            articles: articles
        });
    });
});

/**
 * Dettaglio Evento
 */
router.get('/event/:rid', function (req, res, next) {
    Articles.findOne({
        rid: req.param('rid'),
        active: 1
    }).exec(function (err, article) {
        if (err) return next(err);
        res.render('mobile/event', {
            article: article
        });
    });
});

/**
 * Ricerca
 */
router.get('/search', function (req, res, next) {
    Artists.find({
        fullname: new RegExp(req.query.q, 'i')
    }).populate('category').populate('region').exec(function (err, artists) {
        if (err) return next(err);
        res.render('mobile/search', {
            artists: artists
        });
    });
});

module.exports = router;
