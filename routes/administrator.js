/**
 * mongoose
 * @type {exports}
 */
var mongoose = require('mongoose');

/**
 * passport
 * @type {exports}
 */
var passport = require('passport');

/**
 * express
 * @type {exports}
 */
var express = require('express');
var router = express.Router();

/**
 * model
 */
var Administrators = mongoose.model('administrators');

/**
 * isLoggedIn
 * @param req
 * @param res
 * @param next
 */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
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
        res.render('administrator/index', {});
    })
    .post(passport.authenticate('administrator-local', {
        successRedirect: '/administrator/dashboard',
        failureRedirect: '/login-failure'
    }));

/**
 * Dashboard
 */
router.get('/dashboard', isLoggedIn, function (req, res) {
    Administrators.findById(req.session.passport.user, function (err, admin) {
        if (err) return next(err);
        res.render('administrator/dashboard', {
            user: admin
        });
    });
});

/**
 * Logout
 */
router.get('/logout', isLoggedIn, function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
