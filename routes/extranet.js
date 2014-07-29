var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('extranet_index', {});
});

router.get('/dashboard', function (req, res) {
    res.render('extranet_dashboard', {});
});

router.get('/profile', function (req, res) {
    res.render('extranet_profile', {});
});

router.get('/gallery', function (req, res) {
    res.render('extranet_gallery', {});
});

router.get('/logout', function (req, res) {

});

module.exports = router;
