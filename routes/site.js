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
    Photos.find({}).populate('technique').populate('artist').sort({registered: 'desc'}).limit(6).exec(function (err, photos) {
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
    Photos.find({'cover': 1}).populate('technique').populate('artist').sort({registered: 'desc'}).exec(function (err, photos) {
        console.log(photos);
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
        }).save(function (err, user) {
                if (!err) {
                    res.status(200).send({
                        status: true,
                        user: user
                    });
                } else {
                    res.status(500).send(err);
                }
            });
    });

/**
 * Conferma Registrazione
 */
router.get('/conferma-registrazione', function (req, res) {
    res.render('site/registration-confirmation');
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
                    Photos.distinct('tags', {artist: artist._id}).exec(function (err, tags) {
                        if (err) return next(err);
                        Photos.find({
                            artist: {
                                '$ne': artist._id
                            },
                            tags: {
                                '$in': tags
                            }
                        }).populate('theme').sort({fullname: 'asc'}).limit(4).exec(function (err, related) {
                            if (err) return next(err);
                            res.render('site/artist', {
                                artist: artist,
                                photos: photos,
                                surroundings: surroundings,
                                tags: tags,
                                related: related
                            });
                        });

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

            photo.views = (photo.views + 1);
            photo.save(function (err) {
                if (err) return next(err);
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
    var search = {};
    if (req.query.q) search.tags = new RegExp(req.query.q, 'i');
    if (req.query.technique) search.technique = req.query.technique;
    if (req.query.theme) search.theme = req.query.theme;
    if (req.query.price) search.price = req.query.price;
    if (req.query.year) search.year = req.query.year;
    if (req.query.height) search.height = req.query.height;
    if (req.query.width) search.width = req.query.width;
    if (req.query.depth) search.depth = req.query.depth;
    if (req.query.measure) search.measure = req.query.measure;
    if (req.query.tags) search.tags = {$in: req.query.tags.toLocaleLowerCase().split(',')};

    Techniques.find({}).sort('').exec(function (err, techniques) {
        if (err) return next(err);
        Themes.find({}).sort('').exec(function (err, themes) {
            if (err) return next(err);
            // console.log(search);
            Photos.find(search).populate('technique').populate('artist').sort({registered: 'desc'}).exec(function (err, photos) {
                if (err) return next(err);
                if (photos) {
                    res.render('site/search', {
                        techniques: techniques,
                        themes: themes,
                        photos: photos,
                        query: req.query,
                        measurements: ['cm', 'mm', 'px', 'mt']
                    });
                }
            });
        });
    });
});

/**
 * Tags
 */
router.get('/tags/:tag', function (req, res, next) {
    Photos.find({
        tags: new RegExp(req.param('tag'), 'i')
    }).populate('technique').populate('artist').sort({views: 'desc'}).exec(function (err, photos) {
        if (err) return next(err);
        if (photos) {
            res.render('site/tags', {
                photos: photos
            });
        }
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

/**
 * Galleria Foto
 */
router.get('/photos-:id.json', function (req, res, next) {
    Photos.find({artist: req.param('id')}).populate('technique').exec(function (err, photos) {
        if (err) return next(err);
        res.status(200).send({
            data: photos
        });
    });
});

router.get('/autocomplete/artists.json', function (req, res, next) {
    var q = req.query.query;
    Artists.find({
        fullname: new RegExp(q, 'i')
    }, '_id fullname').exec(function (err, artists) {
        if (err) return next(err);
        // console.log(artists);
        var obj = [];
        for (var nam in artists) {
            obj[nam] = {};
            obj[nam]['value'] = artists[nam].fullname;
            obj[nam]['data'] = artists[nam]._id;
        }
        res.status(200).send({
            query: q,
            suggestions: obj
        });
    });
});
module.exports = router;
