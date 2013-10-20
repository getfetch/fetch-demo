var PetBrowser = (function() {
  var result;
  var dogToDisplay;

  console.log('test');

  function loadDogs(dogs) {
    var breeds = [];
    var $template = $('#pet-template');

    // Load favorite dogs
    var favoriteDogIds = localStorageGetArray('favorites');

    // Render dogs
    $.each(dogs, function(i, dog) {
      console.log("Loading dog: ", dog);

      if(displayId === dog.id) {
        dogToDisplay = dog;
      }

      $.each(dog.breeds, function(i, breed) {
        if($.inArray(breed, breeds) == -1) {
          breeds.push(breed);
        }
      });

      var $dog = $template.clone();
      $dog.data('object', dog);

      $dog.attr('style', '');
      $dog.attr('id', '');
      $dog.addClass(dog.options.join(' '));

      var url = '/browse/' + dog.id;
      var $favoriteLink = $dog.find('.pet-favorite-link');
      $favoriteLink.on('click', function() {
        // Toggle favorite
        if (localStoragePop('favorites', dog.id)) {
          $(this).removeClass('favorited');
        } else {
          localStoragePush('favorites', dog.id);
          $(this).addClass('favorited');
        }
        return false;
      });
      if (favoriteDogIds.indexOf(dog.id.toString()) !== -1) {
        $favoriteLink.addClass('favorited');
      }
      $dog.find('.pet-name').text(dog.name);
      $dog.find('.pet-info-link').attr('href', url);
      $dog.find('.pet-share-link').attr('data-target', '#shareModal-' + dog.id);

      $dog.find('.shareModal').attr('id', 'shareModal-' + dog.id);
      $dog.find('.share-button').attr('st_url', EXTERNAL_URL + url);
      $dog.find('.share-button').attr('st_title', 'How adorable! Take a look at this dog, ' + dog.name + ' #fetch #swpgh');
      $dog.find('.share-button').attr('st_summary', 'How adorable! Take a look at this dog, ' + dog.name + ' #fetch #swpgh');

      $.each(dog.photoUrls, function(i, url) {
        var $img = $('<img src="' + url + '" />');
        $dog.find('.pet-images').append($img);
        if(i > 0) {
          $img.hide();
        }
      });

      $('.pet-container').append($dog);
    });

    // sort and load breeds
    breeds.sort();
    $.each(breeds, function(i, breed) {
      $('#breed').append($('<option value="' + breed + '">' + breed + '</option>'));
    });

    filterDogs();

    if(dogToDisplay) {
      setTimeout(function() {
        Info.popInfo(dogToDisplay);
      }, 100);
    }
  }

  var filter = {
    sex: null,
    age: null,
    size: null,
    breed: 'any'
  };

  function matchesFilter(dog) {
    var matches = (filter.size && dog.size != filter.size) ||
      (filter.sex && dog.sex != filter.sex) ||
      (filter.age && dog.age != filter.age) ||
      (filter.breed != 'any' && $.inArray(filter.breed, dog.breeds));

    return matches;
  }

  function filterDogs() {
    $('.pet-container .pet').each(function() {
      var dog = $(this).data('object');
      if(dog) {
        if(matchesFilter(dog)) {
          $(this).slideUp(250);
        } else {
          $(this).slideDown(250);
        }
      }
    });
  }

  function filterChanged() {
    filter.sex = $('input:radio[name="sex"]:checked').val();
    filter.age = $('input:radio[name="age"]:checked').val();
    filter.size = $('input:radio[name="size"]:checked').val();
    filter.breed = $('#breed').val();

    filterDogs();
  }

  $.getJSON('/data/dogs.json')
  .done(function(data) {
    $(function() {
      loadDogs(data);
    });
  });


  $(function() {
    $('#filter-settings input:radio, #breed').on('change', function() {
      filterChanged();
    });

    $('.pet-container').on('click', '.pet-info-link', function() {
      Info.popInfo($(this).parents('.pet').data('object'));
      return false;
    });
  });

  // Shelters
  //
  var shelterNames = {
    'PA834': 'Biggies Bullies',
    'PA294': 'Animal Advocates'
  };

  result = {
    lookupShelter: function(id) {
      return shelterNames[id] || id;
    }
  };

  return result;
})();
