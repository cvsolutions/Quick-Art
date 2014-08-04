/**
 * mongoose
 * @type {exports}
 */
var mongoose = require('mongoose');

/**
 * model
 */
var Articles = mongoose.model('articles');
var Contents = mongoose.model('contents');

/**
 * express
 * @type {exports}
 */
var express = require('express');
var router = express.Router();

/**
 * Blog Quick-Art
 */
router.get('/', function (req, res) {
    Contents.find({}).sort({fullname: 'asc'}).exec(function (err, contents) {
        if (err) return next(err);
        res.render('blog/index', {
            contents: contents
        });
    });
});

/**
 * Dettaglio Articolo
 */
router.get('/:slug', function (req, res) {
    Articles.findOne({
        slug: req.param('slug'),
        active: 1
    }, function (err, article) {
        if (err) return next(err);
        if (article) {
            res.render('blog/article', {
                article: article
            });
        } else {
            res.status(404).render('site/404');
        }
    }).populate('technique').populate('theme').populate('artist');
});

module.exports = router;
