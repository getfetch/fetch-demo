var FavoriteBrowser = (function() {
  var result;
  var dogToDisplay;

  function loadDogs(dogs) {
    var breeds = [];
    var $template = $('#favorite-template');

    // Filter favorite dogs only
    var favoriteDogIds = localStorageGetArray('favorites');
    dogs = dogs.filter(function(dog) {
      return favoriteDogIds.indexOf(dog.id.toString()) !== -1;
    });

    // Hide 'empty' section
    if (dogs.length > 0) {
      $('.empty-favorites').hide();
    }

    // Render dogs
    $.each(dogs, function(i, dog) {
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

      $dog.find('.favorite-name').text(dog.name);
      $dog.find('.favorite-status').text('Available').addClass('available');
      $dog.find('.favorite-location').text(dog.organization.address);
      $dog.find('.favorite-item').attr('href', '/favorites/' + dog.id);

      // TODO: Use a 'no-photo' image when empty
      var url = dog.photoUrls.length > 0 ? dog.photoUrls[0] : '#';
      $dog.find('.favorite-image').attr('src', url);

      $('.favorite-container').append($dog);
    });

    // sort and load breeds
    breeds.sort();
    $.each(breeds, function(i, breed) {
      $('#breed').append($('<option value="' + breed + '">' + breed + '</option>'));
    });

    if(dogToDisplay) {
      setTimeout(function() {
        Info.popInfo(dogToDisplay);
      }, 100);
    }
  }

  $.getJSON('/data/dogs.json')
  .done(function(data) {
    $(function() {
      loadDogs(data);
    });
  });

  $(function() {

    $('.favorite-container').on('click', '.favorite-item', function() {
      console.log('test');
      Info.popInfo($(this).parents('.favorite').data('object'));
      return false;
    });
  });

  result = {
  };

  return result;
})();
