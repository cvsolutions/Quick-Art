var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Artists = mongoose.model('artists');

/**
 * isLoggedIn
 * @param req
 * @param res
 * @param next
 */
function isLoggedIn(req, res, next) {
    console.log(req.session);
    if (req.session.extranetUser) {
        next();
    } else {
        res.redirect('/extranet');
    }
}


/**
 * Login
 */
router.route('/')
    .get(function (req, res) {
        res.render('extranet/index', {});
    })
    .post(function (req, res) {
        Artists.findOne({
            usermail: req.body.usermail,
            pwd: req.body.pwd
        }).exec(function (err, user) {
            if (!err) {
                if (user) {
                    req.session.save(function (err) {
                        req.session.extranetUser = user;
                        res.status(200).send({
                            user: user,
                            location: 1
                        });
                    });
                } else {
                    req.session.destroy(function (err) {
                        res.status(401).send({
                            text: 'Login fallito!'
                        });
                    });
                }
            } else {
                res.status(500).send(err);
            }
        });
    });

router.get('/dashboard', isLoggedIn, function (req, res) {
    res.render('extranet/dashboard', {});
});

router.get('/profile', isLoggedIn, function (req, res) {
    res.render('extranet/profile', {});
});

router.get('/gallery', isLoggedIn, function (req, res) {
    res.render('extranet/gallery', {});
});

router.get('/gallery/add', isLoggedIn, function (req, res) {
    res.render('extranet/gallery-add', {});
});

router.get('/gallery/edit/:id', isLoggedIn, function (req, res) {
    res.render('extranet/gallery-edit', {});
});

router.get('/gallery/delete/:id', isLoggedIn, function (req, res) {
});

/**
 * Logout
 */
router.get('/logout', isLoggedIn, function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

module.exports = router;
