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

/**
 * express
 * @type {exports}
 */
var express = require('express');
var router = express.Router();

/**
 * Benvenuti su Quick-Art
 */
router.get('/', function (req, res) {
    Photos.find({cover: 1}).populate('technique').sort({registered: 'desc'}).limit(3).exec(function (err, photos) {
        if (err) return next(err);
        Artists.find({active: 1}).populate('category').populate('region').populate('photo').sort({registered: 'desc'}).limit(3).exec(function (err, artists) {
            if (err) return next(err);
            res.render('site/index', {
                photos: photos,
                artists: artists
            });
        });
    });
});

/**
 * loginFailure
 */
router.get('/login-failure', function (req, res) {
    res.render('site/login-failure');
});

/**
 * Artisti Contemporanei
 */
router.get('/artisti-contemporanei', function (req, res) {
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
router.get('/catalogo-opere-arte', function (req, res) {
    Photos.find({cover: 1}).populate('technique').sort({registered: 'desc'}).exec(function (err, photos) {
        if (err) return next(err);
        res.render('site/catalog', {
            photos: photos
        });
    });
});

/**
 * Registrazione
 */
router.route('/registrazione')
    .get(function (req, res) {
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
            usermail: req.body.usermail,
            pwd: req.body.pwd,
            category: mongoose.Types.ObjectId(req.body.category),
            web: req.body.web,
            region: mongoose.Types.ObjectId(req.body.region),
            province: mongoose.Types.ObjectId(req.body.province),
            description: req.body.description,
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
 * Check UserMail (Registrazione)
 */
router.post('/check-usermail', function (req, res) {
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
router.get('/categoria/:slug', function (req, res) {
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
router.get('/regione/:slug', function (req, res) {
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
router.get('/artista/:slug', function (req, res) {
    Artists.findOne({
        slug: req.param('slug'),
        active: 1
    }, function (err, artist) {
        if (err) return next(err);
        if (artist) {
            Photos.find({artist: artist._id}).populate('technique').sort({fullname: 'asc'}).exec(function (err, photos) {
                if (err) return next(err);
                res.render('site/artist', {
                    artist: artist,
                    photos: photos
                });
            });
        } else {
            res.status(404).render('site/404');
        }
    }).populate('category').populate('region').populate('province');
});

router.get('/opera-darte/:slug', function (req, res) {
    Photos.findOne({
        slug: req.param('slug')
    }, function (err, photo) {
        if (err) return next(err);
        if (photo) {
            Photos.find({artist: photo.artist._id}).populate('technique').sort({fullname: 'asc'}).exec(function (err, pictures) {
                if (err) return next(err);
                res.render('site/product', {
                    photo: photo,
                    pictures: pictures
                });
            });
        } else {
            res.status(404).render('site/404');
        }
    }).populate('technique').populate('theme').populate('artist');
});

module.exports = router;
