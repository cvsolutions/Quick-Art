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
router.route('/')
    .get(function (req, res, next) {
        Photos.find({}).populate('technique').populate('artist').sort({
            registered: 'desc'
        }).limit(6).exec(function (err, photos) {
            if (err) return next(err);
            Artists.find({
                active: 1
            }).populate('category').populate('region').populate('photo').sort({
                registered: 'desc'
            }).limit(3).exec(function (err, artists) {
                if (err) return next(err);
                Articles.find({
                    active: 1
                }).populate('content').sort({
                    registered: 'desc'
                }).exec(function (err, articles) {
                    if (err) return next(err);
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
                            Themes.find({}).sort({
                                fullname: 'asc'
                            }).exec(function (err, themes) {
                                if (err) return next(err);
                                res.render('site/index', {
                                    photos: photos,
                                    artists: artists,
                                    articles: articles,
                                    regions: regions,
                                    categories: categories,
                                    themes: themes
                                });
                            });
                        });
                    });
                });
            });
        });
    })
    .post(function (req, res, next) {
        var artist = req.body.artist;
        if (artist) {
            Artists.findById(artist).exec(function (err, row) {
                if (err) return next(err);
                res.redirect('/artista/' + row.slug);
            });
        } else {
            return next();
        }
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
            Artists.count({
                active: 1
            }).exec(function (err, allartists) {
                if (err) return next(err);
                Photos.count({}).exec(function (err, allphotos) {
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
    Photos.find({
        cover: 1
    }).populate('technique').populate('artist').sort({
        registered: 'desc'
    }).exec(function (err, photos) {
        if (err) return next(err);
        Techniques.find({}).sort({
            fullname: 'asc'
        }).exec(function (err, techniques) {
            if (err) return next(err);
            Themes.find({}).sort({
                fullname: 'asc'
            }).exec(function (err, themes) {
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
        Artists({
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
 * Artisti Contemporanei
 * Categoria: Pittura
 */
router.get('/categoria/:slug', function (req, res, next) {
    Categories.findOne({
        slug: req.param('slug'),
        type: 'gallery'
    }).exec(function (err, category) {
        if (err) return next(err);
        if (category) {
            Categories.find({
                type: 'gallery'
            }).sort({
                fullname: 'asc'
            }).exec(function (err, categories) {
                if (err) return next(err);

                var search = {};
                search.category = category._id;
                search.active = 1;
                if (req.query.region && req.query.region.length > 0) search.region = {$in: req.query.region};
                if (req.query.province && req.query.province.length > 0) search.province = {$in: req.query.province};
                // console.log(search);

                Artists.find(search).populate('photo').populate('region').populate('category').populate('province').sort({
                    fullname: 'asc'
                }).exec(function (err, artists) {
                    if (err) return next(err);
                    Themes.find({}).sort({
                        fullname: 'asc'
                    }).exec(function (err, themes) {
                        if (err) return next(err);
                        res.render('site/category', {
                            category: category,
                            categories: categories,
                            artists: artists,
                            themes: themes,
                            query: req.query
                        });
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
    Regions.findOne({
        slug: req.param('slug'
        )}).exec(function (err, region) {
        if (err) return next(err);
        if (region) {
            Regions.find({}).sort({
                fullname: 'asc'
            }).exec(function (err, regions) {
                if (err) return next(err);

                var search = {};
                search.region = region._id;
                search.active = 1;
                if (req.query.category && req.query.category.length > 0) search.category = {$in: req.query.category};
                if (req.query.province && req.query.province.length > 0) search.province = {$in: req.query.province};
                // console.log(search);

                Artists.find(search).populate('photo').populate('region').populate('category').populate('province').sort({
                    fullname: 'asc'
                }).exec(function (err, artists) {
                    if (err) return next(err);
                    Themes.find({}).sort({
                        fullname: 'asc'
                    }).exec(function (err, themes) {
                        if (err) return next(err);
                        res.render('site/region', {
                            region: region,
                            regions: regions,
                            artists: artists,
                            themes: themes,
                            query: req.query
                        });
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
    }).populate('category').populate('region').populate('province').exec(function (err, artist) {
        if (err) return next(err);
        if (artist) {
            Photos.find({
                artist: artist._id
            }).populate('technique').sort({
                fullname: 'asc'
            }).exec(function (err, photos) {
                if (err) return next(err);
                Artists.find({
                    _id: {
                        '$ne': artist._id
                    },
                    province: artist.province
                }).populate('category').populate('photo').sort({
                    fullname: 'asc'
                }).limit(5).exec(function (err, surroundings) {
                    if (err) return next(err);
                    Themes.find({}).sort({
                        fullname: 'asc'
                    }).exec(function (err, themes) {
                        if (err) return next(err);
                        res.render('site/artist', {
                            artist: artist,
                            photos: photos,
                            surroundings: surroundings,
                            themes: themes
                        });
                    });
                });
            });
        } else {
            res.status(404).render('site/404');
        }
    });
});

/**
 * Opera d'Arte
 */
router.get('/opera-darte/:slug', function (req, res, next) {
    Photos.findOne({
        slug: req.param('slug')
    }).populate('technique').populate('theme').populate('artist').exec(function (err, photo) {
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
                }).populate('technique').sort({
                    fullname: 'asc'
                }).exec(function (err, pictures) {
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
    });
});

/**
 * Risultati della ricerca
 */
router.get('/search', function (req, res, next) {
    var search = {};
    if (req.query.q) search.fullname = new RegExp(req.query.q, 'i');
    if (req.query.technique && req.query.technique.length > 0) search.technique = {$in: req.query.technique};
    if (req.query.theme && req.query.theme.length > 0) search.theme = {$in: req.query.theme};
    if (req.query.price) search.price = req.query.price;
    if (req.query.year && req.query.year.length > 0) search.year = {$in: req.query.year};
    if (req.query.height) search.height = req.query.height;
    if (req.query.width) search.width = req.query.width;
    if (req.query.depth) search.depth = req.query.depth;
    if (req.query.measure) search.measure = req.query.measure;
    if (req.query.artist) search.artist = req.query.artist;
    if (req.query.tags) search.tags = {$in: req.query.tags.toLocaleLowerCase().split(',')};
    // console.log(req.query);

    Techniques.find({}).sort({
        fullname: 'asc'
    }).exec(function (err, techniques) {
        if (err) return next(err);
        Themes.find({}).sort({
            fullname: 'asc'
        }).exec(function (err, themes) {
            if (err) return next(err);
            // console.log(search);
            Photos.find(search).populate('technique').populate('artist').populate('theme').sort({
                registered: 'desc'
            }).exec(function (err, photos) {
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
 * Tags (Mare)
 */
router.get('/tags/:tag', function (req, res, next) {
    Photos.find({
        tags: new RegExp(req.param('tag'), 'i')
    }).populate('technique').populate('artist').sort({
        views: 'desc'
    }).exec(function (err, photos) {
        if (err) return next(err);
        if (photos) {
            res.render('site/tags', {
                photos: photos
            });
        } else {
            res.status(404).render('site/404');
        }
    });
});

/**
 * Glossario d'Arte
 */
router.get('/glossario-darte', function (req, res, next) {
    Definitions.find({}).sort({
        fullname: 'asc'
    }).exec(function (err, definitions) {
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
 * Lettera (A) Glossario d'Arte
 */
router.get('/glossario/:letter', function (req, res, next) {
    Definitions.find({
        letter: req.param('letter')
    }).sort({
        fullname: 'asc'
    }).exec(function (err, definitions) {
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
 * Tipologia (Natura Morta)
 */
router.get('/theme/:slug', function (req, res, next) {
    Themes.find({}).sort({
        fullname: 'asc'
    }).exec(function (err, themes) {
        if (err) return next(err);
        Themes.findOne({
            slug: req.param('slug')
        }).exec(function (err, theme) {
            if (err) return next(err);
            if (theme) {
                Photos.find({
                    theme: theme._id
                }).populate('artist').populate('technique').populate('theme').sort({
                    fullname: 'asc'
                }).exec(function (err, photos) {
                    if (err) return next(err);
                    res.render('site/theme', {
                        themes: themes,
                        theme: theme,
                        photos: photos
                    });
                });
            } else {
                res.status(404).render('site/404');
            }
        });
    });
});

/**
 * Tecniche & Strumenti Per Artisti
 */
router.get('/tecniche-strumenti', function (req, res, next) {
    Techniques.find({}).sort({
        fullname: 'asc'
    }).exec(function (err, techniques) {
        if (err) return next(err);
        res.render('site/techniques', {
            techniques: techniques
        });
    });
});

/**
 * Tecnica (Acrilico su Multistrato)
 */
router.get('/tecnica/:slug', function (req, res, next) {
    Techniques.find({}).sort({
        fullname: 'asc'
    }).exec(function (err, techniques) {
        if (err) return next(err);
        Techniques.findOne({
            slug: req.param('slug')
        }).exec(function (err, technique) {
            if (err) return next(err);
            if (technique) {
                Photos.find(
                    {
                        technique: technique._id
                    }
                ).populate('artist').populate('technique').populate('theme').sort({
                        fullname: 'asc'
                    }).exec(function (err, photos) {
                        if (err) return next(err);
                        res.render('site/technique', {
                            techniques: techniques,
                            technique: technique,
                            photos: photos
                        });
                    });
            } else {
                res.status(404).render('site/404');
            }
        });
    });
});

/**
 * Art Directory Scambio link
 */
router.get('/art-directory', function (req, res, next) {
    res.render('site/directory', {
    });
});

/**
 * Annunci Gratis
 */
router.get('/annunci-arte', function (req, res, next) {
    Categories.find({
        type: 'advertising'
    }).exec(function (err, categories) {
        if (err) return next(err);
        res.render('site/advertising', {
            categories: categories
        });
    });
});


module.exports = router;
