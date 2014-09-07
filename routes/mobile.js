var mongoose = require('mongoose');

var Artists = mongoose.model('artists');
var Photos = mongoose.model('photos');
var Categories = mongoose.model('categories');

var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    Artists.find({
        active: 1
    }).populate('category').populate('photo').sort({
        registered: 'desc'
    }).limit(10).exec(function (err, artists) {
        if (err) return next(err);
        Photos.find({
            cover: 1
        }).sort({
            registered: 'desc'
        }).exec(function (err, photos) {
            if (err) return next(err);
            res.render('mobile/index', {
                artists: artists,
                photos: photos
            });
        });
    });
});

router.get('/categories', function (req, res, next) {
    Categories.find({
        type: 'gallery'
    }).sort({
        fullname: 'asc'
    }).exec(function (err, categories) {
        if (err) return next(err);
        res.render('mobile/categories', {
            categories: categories
        });
    });
});

router.get('/category/:slug', function (req, res, next) {
    Categories.findOne({
        slug: req.param('slug'),
        type: 'gallery'
    }).exec(function (err, category) {
        if (err) return next(err);
        Artists.find({
            category: category._id,
            active: 1
        }).populate('region').populate('photo').sort({
            registered: 'desc'
        }).exec(function (err, artists) {
            if (err) return next(err);
            res.render('mobile/category', {
                category: category,
                artists: artists
            });
        });
    });
});

router.get('/artist/:rid', function (req, res, next) {
    Artists.findOne({
        rid: req.param('rid'),
        active: 1
    }).populate('category').populate('region').populate('province').exec(function (err, artist) {
        if (err) return next(err);
        Photos.find({
            artist: artist._id
        }).populate('technique').sort({
            fullname: 'asc'
        }).exec(function (err, photos) {
            if (err) return next(err);
            res.render('mobile/artist', {
                artist: artist,
                photos: photos
            });
        });
    });
});


module.exports = router;
