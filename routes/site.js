/**
 * mongoose
 * @type {exports}
 */
var mongoose = require('mongoose');

var Regions = mongoose.model('regions');
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
    res.render('site_index', {
        supplies: [1, 2, 3, 4, 5, 6]
    });
});

/**
 * Artisti Contemporanei
 */
router.get('/artisti-contemporanei', function (req, res) {
    Regions.find({}).sort({fullname: 'asc'}
    ).exec(function (err, regions) {
            Categories.find({}).sort({fullname: 'asc'}
            ).exec(function (err, categories) {
                    res.render('site_artists', {
                        regions: regions,
                        categories: categories
                    });
                });
        });
});

/**
 * Quadri Moderni
 */
router.get('/quadri-opere-darte', function (req, res) {
    res.render('site_paintings_worksofart', {
        name: req.param('slug'),
        supplies: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    });
});

/**
 * Registrazione
 */
router.route('/registrazione')
    .get(function (req, res) {
        Regions.find({}).sort({fullname: 'asc'}
        ).exec(function (err, regions) {
                Categories.find({}).sort({fullname: 'asc'}
                ).exec(function (err, categories) {
                        res.render('site_registration', {
                            regions: regions,
                            categories: categories
                        });
                    });
            });
    })
    .post(function (req, res) {
        new Artists({
            fullname: req.body.fullname,
            slug: req.body.slug,
            pwd: req.body.pwd,
            usermail: req.body.usermail,
            category: mongoose.Types.ObjectId(req.body.category),
            region: mongoose.Types.ObjectId(req.body.region),
            web: req.body.web,
            description: req.body.description,
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
 * Check Usermail
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

router.get('/categoria/:slug', function (req, res) {
    res.render('site_category', {
        name: req.param('slug'),
        supplies: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    });
});

router.get('/regione/:slug', function (req, res) {
    res.render('site_region', {
        name: req.param('slug')
    });
});

router.get('/artista/:slug', function (req, res) {
    res.render('site_artist', {
        name: req.param('slug'),
        supplies: [1, 2, 3, 4, 5, 6]
    });
});

module.exports = router;
