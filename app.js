var fs = require('fs');
var http = require('http');
var path = require('path');
var util = require('util');
var querystring = require('querystring');
var express = require('express');
var swig = require('swig');
var aggregate = require('./aggregate');
var organization = require('./organization');

// Constants
var ADMIN_EMAIL = 'getfetch@gmail.com';
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
var ADMIN_ZIPCODE = process.env.ADMIN_ZIPCODE || 15220;
var PUBLIC_DIR = path.join(__dirname, 'public');

// App config
var app = express();
app.engine('html', swig.renderFile);
app.use(express.static(PUBLIC_DIR));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: process.env.SECRET_KEY || 'DEVELOPMENT'}));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', process.env.CACHE || false);
swig.setDefaults({ cache: false });

// Middleware
function requireLogin(request, response, next) {
 if (request.session.loggedIn) {
    next();
  } else {
    response.redirect('/login' +
      (request.url ? '?' + querystring.stringify({next: request.url}) : ''));
  }
}

// Routes
app.get('/*', function(request, response, next) {
  // Redirect www to non-www domain
  if(request.headers.host.match(/^www/)) {
    response.redirect(301, 'http://' + request.headers.host.replace(/^www\./, '') + request.url);
  } else {
    next();
  }
});

app.get('/', function(request, response) {
  response.render('index', { /* template locals context */ });
});

app.get('/browse/:id?', function(request, response) {
  response.render('browse', { id: request.params.id });
});

app.get('/info', function(request, response) {
  response.render('info');
});

app.get('/organization/:id', function(request, response) {
  organization.load(request.params.id, function(model){response.render('organization', model)});
});

app.get('/profile', function(request, response){
    var profile = require('./profile');
    profile.load(request.params.id, function(model){response.render('profile', model)});
});

app.get('/about', function(request, response){
    response.render('about');
});

app.get('/contact', function(request, response){
    response.render('contact');
});

app.get('/login', function (request, response) {
  if (request.session.loggedIn) {
    response.redirect('/');
  } else {
    response.render('login', {next: request.query.next});
  }
})
.post('/login', function(request, response) {
  if (request.body.email !== ADMIN_EMAIL || request.body.password !== ADMIN_PASSWORD) {
    response.render('login', {
      email: request.body.email,
      error: 'Incorrect email or password.',
    });
  } else {
    // TODO: Make this more secure
    request.session.loggedIn = true;
    response.redirect(request.body.next || '/');
  }
});

app.get('/logout', function(request, response) {
  request.session.loggedIn = false;
  response.redirect('/');
});

app.get('/admin', requireLogin, function(request, response) {
  response.render('admin');
});

app.get('/aggregate', requireLogin, function(request, response) {
  aggregate.request(ADMIN_ZIPCODE, function(content) {
    response.setHeader('Content-Type', 'application/json');
    response.send(content);
  });
});
app.post('/aggregate', requireLogin, function(request, response) {
  aggregate.pull(ADMIN_ZIPCODE, function(pets) {
    var data_dir = path.join(PUBLIC_DIR, 'data');
    var data_file = path.join(data_dir, 'dogs.json');
    var json = JSON.stringify(pets, null, 2);

    fs.writeFile(data_file, json, function(err) {
      if (err) {
        response.send('Could not generate files. <br /><br />' + err + '<br /><br /><a href="/admin">Back to Admin</a>');
      } else {
        response.send('Files generated successfully. <br /><br /><a href="/admin">Back to Admin</a>');
      }
    });
  });
});

// Run server
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});
