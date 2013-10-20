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

function toArray(item) {
  if (!item) {
    return [];
  } else if (Array.isArray(item)) {
    return item;
  } else {
    return [item];
  }
}

function transform(json) {
  return toArray(json.petfinder.pets.pet).map(function(pet) {
    // TODO: Filter on availability? pet.status['$t'] === 'A'
    return {
      id: pet.id['$t'],
      name: pet.name['$t'],
      description: pet.description['$t'],
      photoUrls: toArray(pet.media.photos.photo)
        .filter(function(photo) { return photo['@size'] === 'x'; })
        .sort(function(photo) { return photo['@id']; })
        .map(function(photo) { return photo['$t']; }),
      age: pet.age['$t'],    // {'Baby', 'Young', 'Adult', 'Senior'}
      sex: pet.sex['$t'],    // {'M', 'F'}
      size: pet.size['$t'],  // {'S', 'M', 'L', 'XL'}
      breeds: toArray(pet.breeds.breed)
        .map(function(breed) { return breed['$t']; }),
      mix: pet.mix['$t'] === 'yes',
      shelter: {
        id: pet.shelterId['$t'],
        email: pet.contact.email['$t'],
      },
      options: toArray(pet.options.option)
        .map(function(option) {
          return option['$t'];
        }),
    };
  });
}

function pull(zipcode, callback) {
  console.log('Fetching dogs...');
  request(zipcode, function(content) {
    petfinder = JSON.parse(content);
    console.log('Transforming...');
    pets = transform(petfinder);
    console.log('Done');
    callback(pets);
  });
}

module.exports.request = request;
module.exports.pull = pull;
