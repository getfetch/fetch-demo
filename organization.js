function load(id, callback){
    callback({
        id: 123,
        name: 'Beagle Rescue',
        type: 'Breeder',
        years_in_biz: '10 yrs',
        location: '123 Main St Pittsburgh, PA 15220',
        email: 'adoption@beaglerescue.com',
        phone: '321.321.3211',
        frequency: 'frequency',
        // photos: [
            // { link: '1.jpg' }
            // { link: '2.jpg' }
            // { link: '2.jpg' }
            // { link: '2.jpg' }
        // ],
        mapKey: 'AIzaSyBAYmvqqrqzql5BU4Ss567fA7_PPhYCV7g',
  });
}

module.exports.load = load;
