var express = require('express');
var router = express.Router();

router.route('/')
    .get(function (req, res) {
        res.render('administrator/index', {});
    })
    .post(function (req, res) {
        console.log(req.body);
        // console.log(req.files);
        // var p = req.files.photo;
        res.status(200).send({
            user: req.body,
            status: 200,
            msg: 'OK'
        });
    });

router.get('/dashboard', function (req, res) {
    res.render('administrator/dashboard', {});
});

router.get('/logout', function (req, res) {
    res.send('...');
});

module.exports = router;
