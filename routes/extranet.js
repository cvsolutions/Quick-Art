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
var Regions = mongoose.model('regions');
var Provinces = mongoose.model('provinces');
var Categories = mongoose.model('categories');
var Artists = mongoose.model('artists');
var Techniques = mongoose.model('techniques');
var Themes = mongoose.model('themes');
var Photos = mongoose.model('photos');

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
        res.redirect('/extranet');
    }
}

/**
 * Login
 */
router.route('/')
    .get(function (req, res) {
        res.render('extranet/index', {});
    })
    .post(passport.authenticate('extranet-local', {
        successRedirect: '/extranet/dashboard',
        failureRedirect: '/login-failure'
    }));

/**
 * Dashboard
 */
router.get('/dashboard', isLoggedIn, function (req, res, next) {
    Artists.findById(req.session.passport.user, function (err, artist) {
        if (err) return next(err);
        res.render('extranet/dashboard', {
            user: artist
        });
    });
});

/**
 * Modifica Profilo
 */
router.route('/profile')
    .get(isLoggedIn, function (req, res, next) {
        Regions.find({}).sort({fullname: 'asc'}).exec(function (err, regions) {
            if (err) return next(err);
            Categories.find({}).sort({fullname: 'asc'}).exec(function (err, categories) {
                if (err) return next(err);
                Provinces.find({}).sort({fullname: 'asc'}).exec(function (err, provinces) {
                    if (err) return next(err);
                    Artists.findById(req.session.passport.user, function (err, artist) {
                        if (err) return next(err);
                        res.render('extranet/profile', {
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
    .post(isLoggedIn, function (req, res) {
        Artists.findById(req.body.id, function (err, artist) {
            artist.fullname = req.body.fullname;
            artist.slug = req.body.slug;
            artist.phone = req.body.phone;
            artist.facebook = req.body.facebook;
            artist.usermail = req.body.usermail;
            artist.pwd = req.body.pwd;
            artist.category = mongoose.Types.ObjectId(req.body.category);
            artist.web = req.body.web;
            artist.region = mongoose.Types.ObjectId(req.body.region);
            artist.province = mongoose.Types.ObjectId(req.body.province);
            artist.biography = req.body.biography;
            artist.reviews = req.body.reviews;
            artist.exhibitions = req.body.exhibitions;
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
 * Check Permalink (Exclude profile)
 */
router.post('/check-exclude-slug', isLoggedIn, function (req, res) {
    Artists.findOne({
        _id: {
            '$ne': req.body.id
        },
        slug: req.body.slug,
        active: 1
    }, function (err, result) {
        if (result) {
            res.status(200).send(false);
        } else {
            res.status(200).send(true);
        }
    });
});

/**
 * Check Usermail (Exclude profile)
 */
router.post('/check-exclude-usermail', isLoggedIn, function (req, res) {
    Artists.findOne({
        _id: {
            '$ne': req.body.id
        },
        usermail: req.body.usermail,
        active: 1
    }, function (err, result) {
        if (result) {
            res.status(200).send(false);
        } else {
            res.status(200).send(true);
        }
    });
});

/**
 * Photo Gallery
 */
router.get('/gallery', isLoggedIn, function (req, res, next) {
    Photos.find({artist: req.session.passport.user}).count().exec(function (err, total) {
        if (err) return next(err);
        res.render('extranet/gallery', {
            total: total
        });
    });
});

/**
 * json photos
 */
router.get('/gallery/photos.json', isLoggedIn, function (req, res, next) {
    Photos.find({artist: req.session.passport.user}).populate('technique').exec(function (err, photos) {
        if (err) return next(err);
        res.status(200).send({
            data: photos
        });
    });
});

/**
 * Check Permalink Picture
 */
router.post('/check-picture-slug', function (req, res, next) {
    Photos.findOne({
        slug: req.body.slug
    }, function (err, result) {
        if (err) return next(err);
        if (result) {
            res.status(200).send(false);
        } else {
            res.status(200).send(true);
        }
    });
});

/**
 * Aggiungi Foto
 */
router.route('/gallery/add')
    .get(isLoggedIn, function (req, res, next) {
        Photos.find({artist: req.session.passport.user}).count().exec(function (err, total) {
            if (err) return next(err);
            if (total >= 6) res.redirect('/extranet/gallery');
        });
        Techniques.find({}).sort({fullname: 'asc'}).exec(function (err, techniques) {
            if (err) return next(err);
            Themes.find({}).sort({fullname: 'asc'}).exec(function (err, themes) {
                if (err) return next(err);
                res.render('extranet/gallery-add', {
                    techniques: techniques,
                    themes: themes,
                    measurements: ['cm', 'mm', 'px', 'mt']
                });
            });
        });
    })
    .post(isLoggedIn, function (req, res) {
        var cover = req.body.cover == 1 ? 1 : 0;
        var available = req.body.available == 1 ? 1 : 0;
        var frame = req.body.frame == 1 ? 1 : 0;
        new Photos({
            fullname: req.body.fullname,
            slug: req.body.slug,
            technique: mongoose.Types.ObjectId(req.body.technique),
            theme: mongoose.Types.ObjectId(req.body.theme),
            description: req.body.description,
            picture: req.files.picture.name,
            height: req.body.height,
            width: req.body.width,
            depth: req.body.depth,
            measure: req.body.measure,
            code: req.body.code,
            price: req.body.price,
            year: req.body.year,
            artist: mongoose.Types.ObjectId(req.session.passport.user),
            tags: req.body.tags.toLocaleLowerCase().split(','),
            cover: cover,
            available: available,
            frame: frame,
            views: 1,
            registered: Date.now()
        }).save(function (err, image) {
                if (!err) {
                    if (cover == 1) {
                        Artists.findById(req.session.passport.user, function (err, artist) {
                            artist.photo = mongoose.Types.ObjectId(image._id);
                            artist.save();
                        });
                    }
                    res.status(200).send({
                        text: 'Operazione eseguita con successo!'
                    });
                } else {
                    res.status(500).send(err);
                }
            });
    });

/**
 * Check Permalink (Exclude Picture)
 */
router.post('/check-exclude-picture-slug', isLoggedIn, function (req, res) {
    Photos.findOne({
        _id: {
            '$ne': req.body.id
        },
        slug: req.body.slug
    }, function (err, result) {
        if (result) {
            res.status(200).send(false);
        } else {
            res.status(200).send(true);
        }
    });
});

/**
 * Modifica Foto
 */
router.route('/gallery/edit/:id')
    .get(isLoggedIn, function (req, res, next) {
        Techniques.find({}).sort({fullname: 'asc'}).exec(function (err, techniques) {
            if (err) return next(err);
            Themes.find({}).sort({fullname: 'asc'}).exec(function (err, themes) {
                if (err) return next(err);
                var ID = req.param('id');
                Photos.findById(ID, function (err, photo) {
                    res.render('extranet/gallery-edit', {
                        techniques: techniques,
                        themes: themes,
                        photo: photo,
                        measurements: ['cm', 'mm', 'px', 'mt']
                    });
                });
            });
        });
    })
    .post(isLoggedIn, function (req, res) {
        var ID = req.body.id;
        var cover = req.body.cover == 1 ? 1 : 0;
        var available = req.body.available == 1 ? 1 : 0;
        var frame = req.body.frame == 1 ? 1 : 0;
        Photos.findById(ID, function (err, photo) {
            var picture = photo.picture;
            if (req.files.picture) {
                picture = req.files.picture.name;
                var target_path = './public/uploads/' + photo.picture;
                fs.unlink(target_path, function () {
                    if (err) return console.error(err);
                });
            }
            photo.fullname = req.body.fullname;
            photo.slug = req.body.slug;
            photo.technique = mongoose.Types.ObjectId(req.body.technique);
            photo.theme = mongoose.Types.ObjectId(req.body.theme);
            photo.description = req.body.description;
            photo.picture = picture;
            photo.height = req.body.height;
            photo.width = req.body.width;
            photo.depth = req.body.depth;
            photo.measure = req.body.measure;
            photo.code = req.body.code;
            photo.price = req.body.price;
            photo.year = req.body.year;
            photo.tags = req.body.tags.toLocaleLowerCase().split(',');
            photo.cover = cover;
            photo.available = available;
            photo.frame = frame;
            photo.save(function (err, image) {
                if (!err) {
                    Artists.findById(image.artist, function (err, artist) {
                        if (cover == 1) {
                            artist.photo = mongoose.Types.ObjectId(image._id);
                            artist.save();
                        }
                    });
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
 * Elimina Foto
 */
router.get('/gallery/delete/:id', isLoggedIn, function (req, res, next) {
    Photos.findById(req.params.id, function (err, photo) {
        var target_path = './public/uploads/' + photo.picture;
        fs.unlink(target_path, function () {
            if (err) return next(err);
        });
        photo.remove(function (err) {
            if (!err) {
                res.redirect('/extranet/gallery');
            }
        });
    });
});

/**
 * Logout
 */
router.get('/logout', isLoggedIn, function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
