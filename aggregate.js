var http = require('http');
var querystring = require('querystring');
var md5 = require('crypto').createHash('md5');

// TODO: Generate new keys and put then in the config instead of version control
var API_KEY = 'c05eebea71cf26cfa156b08689269176';
var API_SECRET = 'b0f53f55688e39e093bdd43fab8f61c5';

function pull(zipcode, callback) {
  var query = querystring.stringify({key: API_KEY, format: 'json', location: zipcode});
  var signature = md5.update(API_SECRET + query).digest('hex');
  var url = 'http://api.petfinder.com/pet.find?' + query + '&' + signature;
  
  var returnData = '';
  var get = http.get(url, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      returnData += chunk;
    });
    res.on('end', function() {
      callback(returnData);
    });
  }).on('error', function(e) {
    // console.log('got error: ' + e.message);
  });
}

module.exports.pull = pull;
