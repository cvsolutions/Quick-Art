var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('site_index', {});
});

router.get('/registrazione', function (req, res) {
    res.render('site_registration', {
        name:req.param('slug')
    });
});

router.get('/categoria/:slug', function (req, res) {
    res.render('site_category', {
        name:req.param('slug')
    });
});

router.get('/regione/:slug', function (req, res) {
    res.render('site_region', {
        name:req.param('slug')
    });
});

router.get('/artista/:slug', function (req, res) {
    res.render('site_artist', {
        name:req.param('slug')
    });
});

module.exports = router;
