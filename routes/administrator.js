var express = require('express');
var router = express.Router();

router.route('/')
    .get(function (req, res, next) {
        res.render('administrator_index', {});
    })
    .post(function (req, res, next) {
        res.status(200).send({msg: 'OK'});
    });

router.get('/dashboard', function (req, res) {
    res.render('administrator_dashboard', {});
});

router.get('/logout', function (req, res) {
    res.send('...');
});

module.exports = router;
