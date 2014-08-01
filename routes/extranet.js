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
router.get('/dashboard', isLoggedIn, function (req, res) {
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
    .get(isLoggedIn, function (req, res) {
        Regions.find({}).sort({fullname: 'asc'}).exec(function (err, regions) {
            Categories.find({}).sort({fullname: 'asc'}).exec(function (err, categories) {
                Provinces.find({}).sort({fullname: 'asc'}).exec(function (err, provinces) {
                    Artists.findById(req.session.passport.user, function (err, artist) {
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
            artist.usermail = req.body.usermail;
            artist.pwd = req.body.pwd;
            artist.category = mongoose.Types.ObjectId(req.body.category);
            artist.web = req.body.web;
            artist.region = mongoose.Types.ObjectId(req.body.region);
            artist.province = mongoose.Types.ObjectId(req.body.province);
            artist.description = req.body.description;
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
router.get('/gallery', isLoggedIn, function (req, res) {
    res.render('extranet/gallery', {});
});

/**
 * json photos
 */
router.get('/gallery/photos.json', isLoggedIn, function (req, res) {
    Photos.find({artist: req.session.passport.user}).populate('technique').exec(function (err, photos) {
        res.status(200).send({
            data: photos
        });
    });
});

/**
 * Aggiungi Foto
 */
router.route('/gallery/add')
    .get(isLoggedIn, function (req, res) {
        Techniques.find({}).sort({fullname: 'asc'}).exec(function (err, techniques) {
            Themes.find({}).sort({fullname: 'asc'}).exec(function (err, themes) {
                res.render('extranet/gallery-add', {
                    techniques: techniques,
                    themes: themes
                });
            });
        });
    })
    .post(isLoggedIn, function (req, res) {
        var cover = req.body.cover == 1 ? 1 : 0;
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
            price: req.body.price,
            artist: mongoose.Types.ObjectId(req.session.passport.user),
            tags: req.body.tags.split(','),
            cover: cover,
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
 * Modifica Foto
 */
router.route('/gallery/edit/:id')
    .get(isLoggedIn, function (req, res) {
        Techniques.find({}).sort({fullname: 'asc'}).exec(function (err, techniques) {
            Themes.find({}).sort({fullname: 'asc'}).exec(function (err, themes) {
                var ID = req.param('id');
                Photos.findById(ID, function (err, photo) {
                    res.render('extranet/gallery-edit', {
                        techniques: techniques,
                        themes: themes,
                        photo: photo
                    });
                });
            });
        });
    })
    .post(isLoggedIn, function (req, res) {
        var ID = req.body.id;
        var cover = req.body.cover == 1 ? 1 : 0;
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
            photo.price = req.body.price;
            photo.tags = req.body.tags;
            photo.cover = cover;
            photo.save(function (err, image) {
                if (!err) {
                    Artists.findById(image.artist, function (err, artist) {
                        if (cover == 1) {
                            artist.photo = mongoose.Types.ObjectId(image._id);
                        } else {
                            artist.photo = undefined;
                        }
                        artist.save();
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
router.get('/gallery/delete/:id', isLoggedIn, function (req, res) {
    Photos.findById(req.params.id, function (err, photo) {
        var target_path = './public/uploads/' + photo.picture;
        fs.unlink(target_path, function () {
            if (err) return console.error(err);
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
