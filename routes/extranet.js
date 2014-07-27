var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('extranet_index', {});
});

router.get('/dashboard', function (req, res) {
    res.render('extranet_dashboard', {});
});

module.exports = router;
