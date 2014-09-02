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
 * sha1
 * @type {api|exports}
 */
var sha1 = require('sha1');

/**
 * passport
 * @type {exports}
 */
var passport = require('passport');

/**
 * nodemailer
 * @type {exports}
 */
var nodemailer = require('nodemailer');

/**
 * exif
 * @type {exports.ExifImage|*}
 */
var ExifImage = require('exif').ExifImage;

/**
 * randomstring
 * @type {exports}
 */
var randomstring = require('randomstring');

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
var Articles = mongoose.model('articles');

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
 * Hai dimenticato la password?
 */
router.route('/password').
    get(function (req, res) {
        res.render('extranet/password');
    })
    .post(function (req, res, next) {
        var pwd = randomstring.generate(7);
        Artists.findOne({
            usermail: req.body.usermail,
            active: 1
        }).exec(function (err, artist) {
            if (err) return next(err);
            artist.pwd = sha1(pwd);
            artist.modification = Date.now();
            artist.save(function (err) {
                if (!err) {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'quickartprojects@gmail.com',
                            pass: 'qu1ck4rtproj3cts'
                        }
                    });
                    transporter.sendMail({
                        from: 'Quick-Art <quickartprojects@gmail.com>',
                        to: req.body.usermail,
                        subject: 'Password Smarrita - Quick-Art',
                        html: 'Gentile Artista, <br> come richiesto ecco le nuove credenziali per accedere al Portale:<br><ul><li>Indirizzo Email: ' + req.body.usermail + '</li><li>Password: ' + pwd + '</li></ul>'
                    }, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            res.status(200).send({
                                mail: info.response,
                                text: 'I tuoi dati sono stati inviati.'
                            });
                        }
                    });
                } else {
                    res.status(500).send(err);
                }
            });
        });
    });

/**
 * Dashboard
 */
router.get('/dashboard', isLoggedIn, function (req, res, next) {
    Artists.findById(req.session.passport.user).exec(function (err, artist) {
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
                    if (err) return next(err);
                    Artists.findById(req.session.passport.user).exec(function (err, artist) {
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
            artist.usermail = req.body.usermail;
            artist.category = mongoose.Types.ObjectId(req.body.category);
            artist.web = req.body.web;
            artist.region = mongoose.Types.ObjectId(req.body.region);
            artist.province = mongoose.Types.ObjectId(req.body.province);
            artist.biography = req.body.biography;
            artist.reviews = req.body.reviews;
            artist.exhibitions = req.body.exhibitions;
            artist.modification = Date.now();
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
 * Modifica Password
 */
router.route('/edit-password')
    .get(isLoggedIn, function (req, res, next) {
        Artists.findById(req.session.passport.user).exec(function (err, artist) {
            if (err) return next(err);
            res.render('extranet/edit-password', {
                artist: artist
            });
        });
    })
    .post(isLoggedIn, function (req, res) {
        Artists.findById(req.body.id, function (err, artist) {
            artist.pwd = sha1(req.body.pwd);
            artist.modification = Date.now();
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
 * Photo Gallery
 */
router.get('/gallery', isLoggedIn, function (req, res, next) {
    Photos.find({
        artist: req.session.passport.user
    }).count().exec(function (err, total) {
        if (err) return next(err);
        res.render('extranet/gallery', {
            total: total
        });
    });
});

/**
 * Aggiungi Foto
 */
router.route('/gallery/add')
    .get(isLoggedIn, function (req, res, next) {
        Photos.find({
            artist: req.session.passport.user
        }).count().exec(function (err, total) {
            if (err) return next(err);
            if (total >= 6) res.redirect('/extranet/gallery');
        });
        Techniques.find({}).sort({
            fullname: 'asc'
        }).exec(function (err, techniques) {
            if (err) return next(err);
            Themes.find({}).sort({
                fullname: 'asc'
            }).exec(function (err, themes) {
                if (err) return next(err);
                res.render('extranet/gallery-add', {
                    techniques: techniques,
                    themes: themes,
                    measurements: ['cm', 'mm', 'px', 'mt']
                });
            });
        });
    })
    .post(isLoggedIn, function (req, res, next) {

        var cover = req.body.cover == 1 ? 1 : 0;
        var available = req.body.available == 1 ? 1 : 0;
        var frame = req.body.frame == 1 ? 1 : 0;

        new ExifImage({
            image: req.files.picture.path
        }, function (error, exifData) {
            if (error) return next(error.message);
            Photos({
                rid: Math.floor(Math.random() * 99999),
                fullname: req.body.fullname,
                slug: req.body.slug,
                technique: mongoose.Types.ObjectId(req.body.technique),
                theme: mongoose.Types.ObjectId(req.body.theme),
                description: req.body.description,
                picture: req.files.picture.name,
                metadata: exifData,
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
                registered: Date.now(),
                modification: Date.now()
            }).save(function (err, image) {
                if (!err) {
                    if (cover == 1) {
                        Artists.findById(req.session.passport.user).exec(function (err, artist) {
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
    });

/**
 * Modifica Foto
 */
router.route('/gallery/edit/:id')
    .get(isLoggedIn, function (req, res, next) {
        Techniques.find({}).sort({
            fullname: 'asc'
        }).exec(function (err, techniques) {
            if (err) return next(err);
            Themes.find({}).sort({
                fullname: 'asc'
            }).exec(function (err, themes) {
                if (err) return next(err);
                var ID = req.param('id');
                Photos.findById(ID).exec(function (err, photo) {
                    if (err) return next(err);
                    if (photo && photo.artist == req.session.passport.user) {
                        res.render('extranet/gallery-edit', {
                            techniques: techniques,
                            themes: themes,
                            photo: photo,
                            measurements: ['cm', 'mm', 'px', 'mt']
                        });
                    } else {
                        res.status(404).render('site/404');
                    }
                });
            });
        });
    })
    .post(isLoggedIn, function (req, res, next) {

        var ID = req.body.id;
        var cover = req.body.cover == 1 ? 1 : 0;
        var available = req.body.available == 1 ? 1 : 0;
        var frame = req.body.frame == 1 ? 1 : 0;

        Photos.findById(ID, function (err, photo) {

            var target_path = './public/uploads/' + photo.picture;
            var picture = photo.picture;
            var image = target_path;

            if (req.files.picture) {
                picture = req.files.picture.name;
                image = req.files.picture.path;
                fs.unlink(target_path, function (err) {
                    if (err) return console.error(err);
                });
            }

            new ExifImage({
                image: image
            }, function (error, exifData) {
                if (error) return next(error.message);
                photo.fullname = req.body.fullname;
                photo.slug = req.body.slug;
                photo.technique = mongoose.Types.ObjectId(req.body.technique);
                photo.theme = mongoose.Types.ObjectId(req.body.theme);
                photo.description = req.body.description;
                photo.picture = picture;
                photo.metadata = exifData;
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
                photo.modification = Date.now();
                photo.save(function (err, image) {
                    if (!err) {
                        Artists.findById(image.artist).exec(function (err, artist) {
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
    });

/**
 * Elimina Foto
 */
router.get('/gallery/delete/:id', isLoggedIn, function (req, res, next) {
    Photos.findById(req.params.id, function (err, photo) {
        var target_path = './public/uploads/' + photo.picture;
        fs.unlink(target_path, function (err) {
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
 * Notizie & Eventi
 */
router.get('/news', isLoggedIn, function (req, res) {
    res.render('extranet/news');
});

/**
 * Aggiungi Articolo
 */
router.route('/news/add')
    .get(isLoggedIn, function (req, res) {
        res.render('extranet/news-add');
    })
    .post(isLoggedIn, function (req, res) {
        var today = new Date();
        Articles({
            rid: Math.floor(Math.random() * 99999),
            fullname: req.body.fullname,
            slug: req.body.slug,
            subtitle: req.body.subtitle,
            description: req.body.description,
            picture: req.files.picture.name,
            content: mongoose.Types.ObjectId('54007362d444cdec9d5de517'),
            artist: mongoose.Types.ObjectId(req.session.passport.user),
            tags: req.body.tags.toLocaleLowerCase().split(','),
            year: today.getFullYear(),
            active: 1,
            home: 1,
            registered: Date.now(),
            modification: Date.now()
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
router.route('/news/edit/:id')
    .get(isLoggedIn, function (req, res, next) {
        var ID = req.param('id');
        Articles.findById(ID).exec(function (err, article) {
            if (err) return next(err);
            if (article && article.artist == req.session.passport.user) {
                res.render('extranet/news-edit', {
                    article: article
                });
            } else {
                res.status(404).render('site/404');
            }
        });
    })
    .post(isLoggedIn, function (req, res) {
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
            article.tags = req.body.tags.toLocaleLowerCase().split(',');
            article.active = active;
            article.home = home;
            article.modification = Date.now();

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
 * Elimina Articolo
 */
router.get('/news/delete/:id', isLoggedIn, function (req, res, next) {
    Articles.findById(req.params.id, function (err, article) {
        var target_path = './public/uploads/' + article.picture;
        fs.unlink(target_path, function (err) {
            if (err) return next(err);
        });
        article.remove(function (err) {
            if (!err) {
                res.redirect('/extranet/news');
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
