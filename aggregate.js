var http = require('http');
var querystring = require('querystring');
var crypto = require('crypto');

// TODO: Generate new keys and put then in the config instead of version control
var API_KEY = 'c05eebea71cf26cfa156b08689269176';
var API_SECRET = 'b0f53f55688e39e093bdd43fab8f61c5';

function request(zipcode, callback) {
  // TODO: Distance option
  // TODO: Filters
  var query = querystring.stringify({key: API_KEY, format: 'json', animal: 'dog', location: zipcode});
  var signature = crypto.createHash('md5').update(API_SECRET + query).digest('hex');
  
  var content = '';

  var url = 'http://api.petfinder.com/pet.find?' + query + '&' + signature;
  var get = http.get(url, function(response) {
    response.setEncoding('utf8');
    response.on('data', function(chunk) {
      content += chunk;
    });
    response.on('end', function() {
      callback(content);
    });
  }).on('error', function(e) {
    console.log('got error: ' + e.message);
  });
}

module.exports.request = request;
