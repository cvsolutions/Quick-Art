var express = require('express');
var multer = require('multer');
var engine = require('ejs-locals');

var app = express();

app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(multer({
    dest: './public/uploads/',
    rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase()
    }
}));

app.use('/', require('./routes/site'));
app.use('/administrator', require('./routes/administrator'));
app.use('/extranet', require('./routes/extranet'));

app.use(function (req, res, next) {
    res.status(404).render('404', {
        message: 'Sorry, page not found...'
    });
});

app.listen(3000, function () {
    console.log('Quick-Art started...');
});
