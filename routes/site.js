var mongoose = require('mongoose');

var Regions = mongoose.model('regions');
var Categories = mongoose.model('categories');

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('site_index', {
        supplies: [1, 2, 3, 4, 5, 6]
    });
});

router.get('/artisti-contemporanei', function (req, res) {
    res.render('site_artists', {
        name: req.param('slug')
    });
});

router.get('/quadri-opere-darte', function (req, res) {
    res.render('site_paintings_worksofart', {
        name: req.param('slug'),
        supplies: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    });
});

router.get('/registrazione', function (req, res) {
    Regions.find(function (err, regions) {
        Categories.find(function (err, categories) {
            res.render('site_registration', {
                name: req.param('slug'),
                regions: regions,
                categories: categories
            });
        });
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
