var http = require("http");
var crypto = require("crypto");

function pull(zip, callback) {
	var baseUrl = "http://api.petfinder.com/";
	var secret = "b0f53f55688e39e093bdd43fab8f61c5";
	var call = "pet.find";
	var key = "key=c05eebea71cf26cfa156b08689269176";
	var format = "format=json";
	var location = "location=" + zip;
	var md5 = crypto.createHash('md5');
	var stringToHash = secret + key + "&" + format + "&" + location;
	var hash = md5.update(stringToHash);
	var sig = "sig=" + hash.digest('hex');
	var returnData = "";

	var url = baseUrl + call + "?" + key + "&" + format + "&" + location + "&" + sig;
	
	var get = http.get(url, function(res) {
	  // console.log('STATUS: ' + res.statusCode);
	  // console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
		returnData += chunk;
	  });
	  res.on('end', function(){
		console.log('close');
		callback(returnData);
	  });
	}).on('error', function(e) {
	  // console.log("got error: " + e.message);
	});
}

module.exports.pull = pull;
