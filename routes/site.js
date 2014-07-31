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
    res.render('site/index', {
        supplies: [1, 2, 3, 4, 5, 6]
    });
});

/**
 * Artisti Contemporanei
 */
router.get('/artisti-contemporanei', function (req, res) {
    Regions.find({}).sort({fullname: 'asc'}).exec(function (err, regions) {
        Categories.find({}).sort({fullname: 'asc'}).exec(function (err, categories) {
            Artists.count({active: 1}, function (err, allartists) {
                res.render('site/artists', {
                    regions: regions,
                    categories: categories,
                    all_artists: allartists
                });
            });
        });
    });
});

/**
 * Catalogo Opere d'Arte
 */
router.get('/catalogo-opere-arte', function (req, res) {
    res.render('site/catalog', {
        name: req.param('slug'),
        supplies: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    });
});

/**
 * Registrazione
 */
router.route('/registrazione')
    .get(function (req, res) {
        Regions.find({}).sort({fullname: 'asc'}).exec(function (err, regions) {
            Categories.find({}).sort({fullname: 'asc'}).exec(function (err, categories) {
                Provinces.find({}).sort({fullname: 'asc'}).exec(function (err, provinces) {
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
        Categories.find({}).sort({fullname: 'asc'}).exec(function (err, categories) {
            Artists.find({
                category: category._id,
                active: 1
            }).sort({fullname: 'asc'}).exec(function (err, artists) {
                res.render('site/category', {
                    category: category,
                    categories: categories,
                    artists: artists
                });
            });
        });
    });
});

/**
 * Artisti Contemporanei
 * Regione: Sicilia
 */
router.get('/regione/:slug', function (req, res) {
    Regions.findOne({slug: req.param('slug')}, function (err, region) {
        Regions.find({}).sort({fullname: 'asc'}).exec(function (err, regions) {
            Artists.find({
                region: region._id,
                active: 1
            }).sort({fullname: 'asc'}).exec(function (err, artists) {
                res.render('site/region', {
                    region: region,
                    regions: regions,
                    artists: artists
                });
            });
        });
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
        res.render('site/artist', {
            artist: artist,
            supplies: [1, 2, 3, 4, 5, 6]
        });
    }).populate('category').populate('region').populate('province');
});

module.exports = router;
