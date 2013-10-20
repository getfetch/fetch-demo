var dogs = require('./public/data/dogs.json');

function load(id, callback){
    var model;
    
    for(var key in dogs){
        if(dogs[key].organization.id == id){
            var organization = dogs[key].organization;
            model = {
                id: organization.id,
                name: organization.name,
                type: capitaliseFirstLetter(organization.type),
                years_in_biz: organization.yrs_in_biz,
                location: organization.address,
                email: organization.email,
                phone: organization.phone,
                frequency: organization.frequency,
                photos: [
                    { link: '1.jpg' },
                    { link: '2.jpg' },
                    { link: '2.jpg' },
                    { link: '2.jpg' }
                ],
                mapKey: 'AIzaSyBAYmvqqrqzql5BU4Ss567fA7_PPhYCV7g',
            }
            break;
        }
    }

    callback(model);
}

function capitaliseFirstLetter(string)
{
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports.load = load;
