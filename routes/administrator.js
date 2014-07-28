var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('administrator_index', {});
});

router.post('/login', function (req, res) {
    console.log(req.body);
    res.status(200).send({
        phone: req.body.phone,
        status: 200,
        msg: 'OK'
    });
});

router.get('/dashboard', function (req, res) {
    res.render('administrator_dashboard', {});
});

router.get('/logout', function (req, res) {
    res.send('...');
});

module.exports = router;
