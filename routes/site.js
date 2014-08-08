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
var Photos = mongoose.model('photos');
var Techniques = mongoose.model('techniques');
var Themes = mongoose.model('themes');
var Definitions = mongoose.model('definitions');
var Articles = mongoose.model('articles');

/**
 * express
 * @type {exports}
 */
var express = require('express');
var router = express.Router();

/**
 * Globals
 */
router.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.extranet = true;
    } else {
        res.locals.extranet = false;
    }
    next();
});

/**
 * Benvenuti su Quick-Art
 */
router.get('/', function (req, res, next) {
    Photos.find({}).populate('technique').sort({registered: 'desc'}).limit(3).exec(function (err, photos) {
        if (err) return next(err);
        Artists.find({active: 1}).populate('category').populate('region').populate('photo').sort({registered: 'desc'}).limit(3).exec(function (err, artists) {
            if (err) return next(err);
            Articles.find({active: 1}).populate('content').sort({registered: 'desc'}).exec(function (err, articles) {
                if (err) return next(err);
                res.render('site/index', {
                    photos: photos,
                    artists: artists,
                    articles: articles
                });
            });
        });
    });
});

/**
 * Login Failure
 */
router.get('/login-failure', function (req, res) {
    res.render('site/login-failure');
});

/**
 * Artisti Contemporanei
 */
router.get('/artisti-contemporanei', function (req, res, next) {
    Regions.find({}).sort({fullname: 'asc'}).exec(function (err, regions) {
        if (err) return next(err);
        Categories.find({}).sort({fullname: 'asc'}).exec(function (err, categories) {
            if (err) return next(err);
            Artists.count({active: 1}, function (err, allartists) {
                if (err) return next(err);
                Photos.count({}, function (err, allphotos) {
                    if (err) return next(err);
                    res.render('site/artists', {
                        regions: regions,
                        categories: categories,
                        all_artists: allartists,
                        all_photos: allphotos
                    });
                });
            });
        });
    });
});

/**
 * Catalogo Opere d'Arte
 */
router.get('/catalogo-opere-arte', function (req, res, next) {
    Photos.find({cover: 1}).populate('technique').sort({registered: 'desc'}).exec(function (err, photos) {
        if (err) return next(err);
        Techniques.find({}).sort('').exec(function (err, techniques) {
            if (err) return next(err);
            Themes.find({}).sort('').exec(function (err, themes) {
                if (err) return next(err);
                res.render('site/catalog', {
                    techniques: techniques,
                    themes: themes,
                    photos: photos
                });
            });
        });
    });
});

/**
 * Registrazione
 */
router.route('/registrazione')
    .get(function (req, res, next) {
        Regions.find({}).sort({fullname: 'asc'}).exec(function (err, regions) {
            if (err) return next(err);
            Categories.find({}).sort({fullname: 'asc'}).exec(function (err, categories) {
                if (err) return next(err);
                Provinces.find({}).sort({fullname: 'asc'}).exec(function (err, provinces) {
                    if (err) return next(err);
                    res.render('site/registration', {
                        regions: regions,
                        provinces: provinces,
                        categories: categories
                    });
                });
            });
        });
    })
    .post(function (req, res) {
        new Artists({
            fullname: req.body.fullname,
            slug: req.body.slug,
            phone: req.body.phone,
            facebook: req.body.facebook,
            usermail: req.body.usermail,
            pwd: req.body.pwd,
            category: mongoose.Types.ObjectId(req.body.category),
            web: req.body.web,
            region: mongoose.Types.ObjectId(req.body.region),
            province: mongoose.Types.ObjectId(req.body.province),
            biography: req.body.biography,
            reviews: req.body.reviews,
            exhibitions: req.body.exhibitions,
            level: 1,
            active: 1,
            registered: Date.now()
        }).save(function (err) {
                if (!err) {
                    res.status(200).send({
                        text: 'Complimenti, la registrazione è avvenuta con successo!'
                    });
                } else {
                    res.status(500).send(err);
                }
            });
    });

/**
 * Check Permalink (Registrazione)
 */
router.post('/check-slug', function (req, res, next) {
    Artists.findOne({
        slug: req.body.slug,
        active: 1
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
 * Check UserMail (Registrazione)
 */
router.post('/check-usermail', function (req, res, next) {
    Artists.findOne({
        usermail: req.body.usermail,
        active: 1
    }, function (err, result) {
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
 * Artisti Contemporanei
 * Categoria: Pittura
 */
router.get('/categoria/:slug', function (req, res, next) {
    Categories.findOne({slug: req.param('slug')}, function (err, category) {
        if (err) return next(err);
        if (category) {
            Categories.find({}).sort({fullname: 'asc'}).exec(function (err, categories) {
                if (err) return next(err);
                Artists.find({
                    category: category._id,
                    active: 1
                }).populate('photo').populate('province').sort({fullname: 'asc'}).exec(function (err, artists) {
                    if (err) return next(err);
                    res.render('site/category', {
                        category: category,
                        categories: categories,
                        artists: artists
                    });
                });
            });
        } else {
            res.status(404).render('site/404');
        }
    });
});

/**
 * Artisti Contemporanei
 * Regione: Sicilia
 */
router.get('/regione/:slug', function (req, res, next) {
    Regions.findOne({slug: req.param('slug')}, function (err, region) {
        if (err) return next(err);
        if (region) {
            Regions.find({}).sort({fullname: 'asc'}).exec(function (err, regions) {
                if (err) return next(err);
                Artists.find({
                    region: region._id,
                    active: 1
                }).populate('photo').populate('province').sort({fullname: 'asc'}).exec(function (err, artists) {
                    if (err) return next(err);
                    res.render('site/region', {
                        region: region,
                        regions: regions,
                        artists: artists
                    });
                });
            });
        } else {
            res.status(404).render('site/404');
        }
    });
});

/**
 * Artista
 */
router.get('/artista/:slug', function (req, res, next) {
    Artists.findOne({
        slug: req.param('slug'),
        active: 1
    }, function (err, artist) {
        if (err) return next(err);
        if (artist) {
            Photos.find({artist: artist._id}).populate('technique').sort({fullname: 'asc'}).exec(function (err, photos) {
                if (err) return next(err);
                Artists.find({
                    _id: {
                        '$ne': artist._id
                    },
                    province: artist.province
                }).populate('category').populate('photo').sort({fullname: 'asc'}).limit(5).exec(function (err, surroundings) {
                    if (err) return next(err);
                    res.render('site/artist', {
                        artist: artist,
                        photos: photos,
                        surroundings: surroundings
                    });
                });
            });
        } else {
            res.status(404).render('site/404');
        }
    }).populate('category').populate('region').populate('province');
});

/**
 * Opera d'Arte
 */
router.get('/opera-darte/:slug', function (req, res, next) {
    Photos.findOne({
        slug: req.param('slug')
    }, function (err, photo) {
        if (err) return next(err);
        if (photo) {
            Photos.find({
                _id: {
                    '$ne': photo._id
                },
                artist: photo.artist._id
            }).populate('technique').sort({fullname: 'asc'}).exec(function (err, pictures) {
                if (err) return next(err);
                Photos.find({
                    _id: {
                        '$ne': photo._id
                    },
                    tags: {
                        '$in': photo.tags
                    }
                }).populate('artist').populate('technique').limit(4).exec(function (err, related) {
                    if (err) return next(err);
                    res.render('site/product', {
                        photo: photo,
                        pictures: pictures,
                        related: related
                    });
                });
            });
        } else {
            res.status(404).render('site/404');
        }
    }).populate('technique').populate('theme').populate('artist');
});

/**
 * Search
 */
router.get('/search', function (req, res, next) {
    res.render('site/search', {
        article: 0
    });
});

/**
 * Glossario d'Arte
 */
router.get('/glossario-darte', function (req, res, next) {
    Definitions.find({}).sort({fullname: 'asc'}).exec(function (err, definitions) {
        if (err) return next(err);
        Definitions.distinct('letter').exec(function (err, letters) {
            if (err) return next(err);
            res.render('site/glossary', {
                letters: letters,
                definitions: definitions
            });
        });
    });
});

/**
 * Lettere Glossario d'Arte
 */
router.get('/glossario/:letter', function (req, res, next) {
    Definitions.find({letter: req.param('letter')}).sort({fullname: 'asc'}).exec(function (err, definitions) {
        if (err) return next(err);
        if (definitions) {
            Definitions.distinct('letter').exec(function (err, letters) {
                if (err) return next(err);
                res.render('site/glossary', {
                    letters: letters,
                    definitions: definitions
                });
            });
        } else {
            res.status(404).render('site/404');
        }
    });
});

module.exports = router;
