/**
 * express
 * @type {exports}
 */
var express = require('express');
var router = express.Router();

/**
 * mongoose
 * @type {exports}
 */
var mongoose = require('mongoose');

/**
 * model
 */
var Regions = mongoose.model('regions');
var Provinces = mongoose.model('provinces');
var Categories = mongoose.model('categories');
var Artists = mongoose.model('artists');

/**
 * isLoggedIn
 * @param req
 * @param res
 * @param next
 */
function isLoggedIn(req, res, next) {
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
            pwd: req.body.pwd,
            active: 1
        }).exec(function (err, user) {
            if (!err) {
                if (user) {
                    req.session.regenerate(function (err) {
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

/**
 * Dashboard
 */
router.get('/dashboard', isLoggedIn, function (req, res) {
    res.render('extranet/dashboard', {
        user: req.session.extranetUser
    });
});

/**
 * Modifica Profilo
 */
router.route('/profile')
    .get(isLoggedIn, function (req, res) {
        Regions.find({}).sort({fullname: 'asc'}).exec(function (err, regions) {
            Categories.find({}).sort({fullname: 'asc'}).exec(function (err, categories) {
                Provinces.find({}).sort({fullname: 'asc'}).exec(function (err, provinces) {
                    Artists.findOne({
                        slug: req.session.extranetUser.slug,
                        active: 1
                    }, function (err, artist) {
                        res.render('extranet/profile', {
                            artist: artist,
                            regions: regions,
                            provinces: provinces,
                            categories: categories
                        });
                    });
                });
            });
        });
    })
    .post(isLoggedIn, function (req, res) {

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
