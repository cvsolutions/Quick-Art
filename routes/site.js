var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {});
});

router.get('/artista/:slug', function (req, res) {
    res.render('detail_artist', {});
});

module.exports = router;
