/**
 * mongoose
 * @type {exports}
 */
var mongoose = require('mongoose');

/**
 * passport
 * @type {exports}
 */
var passport = require('passport');

/**
 * express
 * @type {exports}
 */
var express = require('express');
var router = express.Router();

/**
 * model
 */
var Administrators = mongoose.model('administrators');
var Contents = mongoose.model('contents');
var Articles = mongoose.model('articles');
var Artists = mongoose.model('artists');

/**
 * isLoggedIn
 * @param req
 * @param res
 * @param next
 */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/administrator');
    }
}

/**
 * Login
 */
router.route('/')
    .get(function (req, res) {
        res.render('administrator/index', {});
    })
    .post(passport.authenticate('administrator-local', {
        successRedirect: '/administrator/dashboard',
        failureRedirect: '/login-failure'
    }));

/**
 * Dashboard
 */
router.get('/dashboard', isLoggedIn, function (req, res) {
    Administrators.findById(req.session.passport.user, function (err, admin) {
        if (err) return next(err);
        res.render('administrator/dashboard', {
            user: admin
        });
    });
});

/**
 * Artisti Contemporanei
 */
router.get('/artists', isLoggedIn, function (req, res) {
    res.render('administrator/artists');
});

router.get('/artists.json', isLoggedIn, function (req, res) {
    Artists.find({}).populate('category').populate('region').exec(function (err, artists) {
        if (err) return next(err);
        res.status(200).send({
            data: artists
        });
    });
});

/**
 * Articoli
 */
router.get('/articles', isLoggedIn, function (req, res) {
    res.render('administrator/articles');
});

/**
 * Articoli JSON
 */
router.get('/articles.json', isLoggedIn, function (req, res) {
    Articles.find({}).populate('content').exec(function (err, articles) {
        if (err) return next(err);
        res.status(200).send({
            data: articles
        });
    });
});

/**
 * Nuovo Articolo
 */
router.route('/articles/add')
    .get(isLoggedIn, function (req, res) {
        Contents.find({}).sort({fullname: 'asc'}).exec(function (err, contents) {
            if (err) return next(err);
            res.render('administrator/articles-add', {
                contents: contents
            });
        });
    })
    .post(isLoggedIn, function (req, res) {
        new Articles({
            fullname: req.body.fullname,
            slug: req.body.slug,
            description: req.body.description,
            content: mongoose.Types.ObjectId(req.body.content),
            tags: req.body.tags.split(','),
            active: 1,
            registered: Date.now()
        }).save(function (err) {
                if (!err) {
                    res.status(200).send({
                        text: 'Operazione eseguita con successo!'
                    });
                } else {
                    res.status(500).send(err);
                }
            });
    });

/**
 * Modifica Articolo
 */
router.route('/articles/edit/:id')
    .get(isLoggedIn, function (req, res) {
        Contents.find({}).sort({fullname: 'asc'}).exec(function (err, contents) {
            if (err) return next(err);
            var ID = req.param('id');
            Articles.findById(ID, function (err, article) {
                res.render('administrator/articles-edit', {
                    contents: contents,
                    article: article
                });
            });
        });
    })
    .post(isLoggedIn, function (req, res) {
        var active = req.body.active == 1 ? 1 : 0;
        Articles.findById(req.body.id, function (err, article) {
            article.fullname = req.body.fullname;
            article.slug = req.body.slug;
            article.description = req.body.description;
            article.content = mongoose.Types.ObjectId(req.body.content);
            article.tags = req.body.tags.split(',');
            article.active = active;
            article.save(function (err) {
                if (!err) {
                    res.status(200).send({
                        text: 'Operazione eseguita con successo!'
                    });
                } else {
                    res.status(500).send(err);
                }
            });
        });
    });

/**
 * Logout
 */
router.get('/logout', isLoggedIn, function (req, res) {
    req.logout();
    res.redirect('/administrator');
});

module.exports = router;
