/**
 * mongoose
 * @type {exports}
 */
var mongoose = require('mongoose');

/**
 * fs
 * @type {exports}
 */
var fs = require('fs');

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
var Regions = mongoose.model('regions');
var Provinces = mongoose.model('provinces');
var Categories = mongoose.model('categories');
var Directories = mongoose.model('directories');

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
router.get('/dashboard', isLoggedIn, function (req, res, next) {
    Administrators.findById(req.session.passport.user).exec(function (err, admin) {
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

/**
 * Modifica Artista
 */
router.route('/artists/edit/:id')
    .get(isLoggedIn, function (req, res, next) {
        Regions.find({}).sort({
            fullname: 'asc'
        }).exec(function (err, regions) {
            if (err) return next(err);
            Categories.find({
                type: 'gallery'
            }).sort({
                fullname: 'asc'
            }).exec(function (err, categories) {
                if (err) return next(err);
                Provinces.find({}).sort({
                    fullname: 'asc'
                }).exec(function (err, provinces) {
                    var ID = req.param('id');
                    if (err) return next(err);
                    Artists.findById(ID).exec(function (err, artist) {
                        if (err) return next(err);
                        res.render('administrator/artists-edit', {
                            artist: artist,
                            regions: regions,
                            provinces: provinces,
                            categories: categories
                        });
                    });
                });
            });
        });
    })
    .post(isLoggedIn, function (req, res, next) {
        var active = req.body.active == 1 ? 1 : 0;
        Artists.findById(req.body.id, function (err, artist) {
            artist.fullname = req.body.fullname;
            artist.slug = req.body.slug;
            artist.phone = req.body.phone;
            artist.usermail = req.body.usermail;
            artist.category = mongoose.Types.ObjectId(req.body.category);
            artist.web = req.body.web;
            artist.region = mongoose.Types.ObjectId(req.body.region);
            artist.province = mongoose.Types.ObjectId(req.body.province);
            artist.biography = req.body.biography;
            artist.reviews = req.body.reviews;
            artist.exhibitions = req.body.exhibitions;
            artist.active = active;
            artist.save(function (err) {
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
 * Articoli
 */
router.get('/articles', isLoggedIn, function (req, res) {
    res.render('administrator/articles');
});

/**
 * Nuovo Articolo
 */
router.route('/articles/add')
    .get(isLoggedIn, function (req, res, next) {
        Contents.find({}).sort({
            fullname: 'asc'
        }).exec(function (err, contents) {
            if (err) return next(err);
            Artists.find({}).sort({
                fullname: 'asc'
            }).exec(function (err, artists) {
                if (err) return next(err);
                res.render('administrator/articles-add', {
                    contents: contents,
                    artists: artists
                });
            });
        });
    })
    .post(isLoggedIn, function (req, res) {
        var home = req.body.home == 1 ? 1 : 0;
        var today = new Date();
        Articles({
            rid: Math.floor(Math.random() * 99999),
            fullname: req.body.fullname,
            slug: req.body.slug,
            subtitle: req.body.subtitle,
            description: req.body.description,
            picture: req.files.picture.name,
            content: mongoose.Types.ObjectId(req.body.content),
            artist: mongoose.Types.ObjectId(req.body.artist),
            tags: req.body.tags.toLocaleLowerCase().split(','),
            year: today.getFullYear(),
            active: 1,
            home: home,
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
    .get(isLoggedIn, function (req, res, next) {
        Contents.find({}).sort({
            fullname: 'asc'
        }).exec(function (err, contents) {
            if (err) return next(err);
            var ID = req.param('id');
            Articles.findById(ID).exec(function (err, article) {
                Artists.find({}).sort({
                    fullname: 'asc'
                }).exec(function (err, artists) {
                    if (err) return next(err);
                    res.render('administrator/articles-edit', {
                        contents: contents,
                        article: article,
                        artists: artists
                    });
                });
            });
        });
    })
    .post(isLoggedIn, function (req, res, next) {
        Articles.findById(req.body.id).exec(function (err, article) {

            var active = req.body.active == 1 ? 1 : 0;
            var home = req.body.home == 1 ? 1 : 0;
            var picture = article.picture;

            if (req.files.picture) {
                picture = req.files.picture.name;
                var target_path = './public/uploads/' + article.picture;
                fs.unlink(target_path, function (err) {
                    if (err) return next(err);
                });
            }

            article.fullname = req.body.fullname;
            article.slug = req.body.slug;
            article.subtitle = req.body.subtitle;
            article.description = req.body.description;
            article.picture = picture;
            article.content = mongoose.Types.ObjectId(req.body.content);
            article.artist = mongoose.Types.ObjectId(req.body.artist);
            article.tags = req.body.tags.toLocaleLowerCase().split(',');
            article.active = active;
            article.home = home;
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
 * Art Directory
 */
router.get('/directory', isLoggedIn, function (req, res) {
    res.render('administrator/directories');
});

/**
 * Modifica Art Directory
 */
router.route('/directory/edit/:id')
    .get(isLoggedIn, function (req, res, next) {
        Categories.find({
            type: 'directory'
        }).sort({
            fullname: 'asc'
        }).exec(function (err, categories) {
            if (err) return next(err);
            var ID = req.param('id');
            Directories.findById(ID).exec(function (err, directories) {
                if (err) return next(err);
                res.render('administrator/directories-edit', {
                    categories: categories,
                    directories: directories
                });
            });
        });
    })
    .post(isLoggedIn, function (req, res, next) {
        Directories.findById(req.body.id).exec(function (err, directory) {
            var active = req.body.active == 1 ? 1 : 0;
            directory.fullname = req.body.fullname;
            directory.description = req.body.description;
            directory.category = mongoose.Types.ObjectId(req.body.category);
            directory.web = req.body.web;
            directory.active = active;
            directory.save(function (err) {
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
