var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var swig = require('swig');
var aggregate = require('./aggregate');

// App config
app.engine('html', swig.renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', process.env.CACHE || false);
swig.setDefaults({ cache: false });

// Routes
app.get('/', function (request, response) {
  response.render('index', { /* template locals context */ });
});

// Run server
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});
