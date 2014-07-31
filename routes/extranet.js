/**
 * express
 * @type {exports}
 */
var express = require('express');
var router = express.Router();

/**
 * mongoose
 * @type {exports}
 */
var mongoose = require('mongoose');

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
    if (req.session.extranetUser) {
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
    .post(function (req, res) {
        Artists.findOne({
            usermail: req.body.usermail,
            pwd: req.body.pwd,
            active: 1
        }).exec(function (err, user) {
            if (!err) {
                if (user) {
                    req.session.regenerate(function (err) {
                        req.session.extranetUser = user;
                        res.status(200).send({
                            user: user,
                            location: 1
                        });
                    });
                } else {
                    req.session.destroy(function (err) {
                        res.status(401).send({
                            text: 'Login fallito!'
                        });
                    });
                }
            } else {
                res.status(500).send(err);
            }
        });
    });

/**
 * Dashboard
 */
router.get('/dashboard', isLoggedIn, function (req, res) {
    res.render('extranet/dashboard', {
        user: req.session.extranetUser
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
                    Artists.findById(req.session.extranetUser._id, function (err, artist) {
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
    Photos.find({artist: req.session.extranetUser._id}).populate('technique').exec(function (err, photos) {
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
            artist: mongoose.Types.ObjectId(req.session.extranetUser._id),
            tags: req.body.tags.split(','),
            cover: cover,
            registered: Date.now()
        }).save(function (err, image) {
                if (!err) {
                    if (cover == 1) {
                        Artists.findById(req.session.extranetUser._id, function (err, artist) {
                            artist.photo = mongoose.Types.ObjectId(image._id);
                            artist.save();
                        });
                    }
                    res.status(200).send({
                        id: image,
                        text: 'Complimenti, la registrazione è avvenuta con successo!'
                    });
                } else {
                    res.status(500).send(err);
                }
            });
    });


router.get('/gallery/edit/:id', isLoggedIn, function (req, res) {
    res.render('extranet/gallery-edit', {});
});

router.get('/gallery/delete/:id', isLoggedIn, function (req, res) {
});

/**
 * Logout
 */
router.get('/logout', isLoggedIn, function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

module.exports = router;
