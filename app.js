var express = require('express');
var ejs = require('ejs');

var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/', require('./routes/site'));
app.use('/administrator', require('./routes/administrator'));
app.use('/extranet', require('./routes/extranet'));

app.listen(3000);
console.log('Quick-Art started...');
