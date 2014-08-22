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
router.get('/', function (req, res, next) {
    Contents.find({
        show: 1
    }).sort({
        fullname: 'asc'
    }).exec(function (err, contents) {
        if (err) return next(err);
        Articles.find({
            active: 1,
        }).populate('content').sort({
            views: 'desc'
        }).limit(6).exec(function (err, articles) {
            if (err) return next(err);
            Articles.find({
                active: 1,
            }).populate('content').sort({
                registered: 'desc'
            }).limit(10).exec(function (err, last) {
                if (err) return next(err);
                res.render('blog/index', {
                    contents: contents,
                    articles: articles,
                    last: last
                });
            });
        });
    });
});

/**
 * Categorie Articoli
 */
router.get('/articoli/:slug', function (req, res, next) {
    Contents.find({
        show: 1
    }).sort({
        fullname: 'asc'
    }).exec(function (err, contents) {
        if (err) return next(err);
        Contents.findOne({
            slug: req.param('slug')
        }).exec(function (err, content) {
            if (err) return next(err);
            if (content) {
                Articles.find({
                    content: content._id
                }).sort({
                    registered: 'desc'
                }).exec(function (err, articles) {
                    if (err) return next(err);
                    res.render('blog/articles', {
                        content: content,
                        contents: contents,
                        articles: articles
                    });
                });
            } else {
                res.status(404).render('site/404');
            }
        });
    });
});

/**
 * Tags Articoli
 */
router.get('/tags/:tag', function (req, res, next) {
    Contents.find({
        show: 1
    }).sort({
        fullname: 'asc'
    }).exec(function (err, contents) {
        if (err) return next(err);
        Articles.find({
            active: 1,
            tags: new RegExp(req.param('tag'), 'i')
        }).sort({
            registered: 'desc'
        }).exec(function (err, articles) {
            if (err) return next(err);
            res.render('blog/tags', {
                tag: req.param('tag'),
                contents: contents,
                articles: articles
            });
        });
    });
});

/**
 * Dettaglio Articolo
 */
router.get('/:rid/:slug', function (req, res, next) {
    Articles.findOne({
        rid: req.param('rid'),
        slug: req.param('slug'),
        active: 1
    }).populate('content').populate('artist').exec(function (err, article) {
        if (err) return next(err);
        if (article) {
            article.views = (article.views + 1);
            article.save(function (err) {
                if (err) return next(err);
                Articles.find({
                    active: 1,
                    _id: {
                        '$ne': article._id
                    },
                    tags: {
                        '$in': article.tags
                    }
                }).exec(function (err, related) {
                    if (err) return next(err);
                    res.render('blog/article', {
                        article: article,
                        related: related
                    });
                });
            });
        } else {
            res.status(404).render('site/404');
        }
    });
});

module.exports = router;
