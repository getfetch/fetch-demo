var FavoriteBrowser = (function() {
  var result;
  var dogToDisplay;

  function loadDogs(dogs) {
    var breeds = [];
    var $template = $('#favorite-template');

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
        displayDog(dogToDisplay);
      }, 100);
    }
  }

  $.getJSON('/data/dogs.json')
  .done(function(data) {
    $(function() {
      loadDogs(data);
    });
  });

  // Shelters
  //
  var shelterNames = {
    'PA834': 'Biggies Bullies',
    'PA294': 'Animal Advocates'
  };

  function lookupShelter(id) {
    return shelterNames[id] || id;
  }

  // Info page
  //
  var infoDoc;
  var pageCache;

  $.ajax('/info')
    .done(function(data) {
      infoDoc = createDocument(data);
      console.log(infoDoc);
    });

  function cachePage() {
    pageCache = {
      title: document.title,
      body: document.body,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
  }

  $(window).on('popstate', function() {
    restoreCachedPage();
  });

  function restoreCachedPage() {
    if(!pageCache) {
      return;
    }

    document.title = pageCache.title;
    document.documentElement.replaceChild(pageCache.body, document.body);

    window.history.replaceState({}, '', '/favorites');

    PageSetup();

    window.scrollTo(pageCache.positionX, pageCache.positionY);
  }

  function createDocument(html) {
    var doc = document.implementation.createHTMLDocument('');
    doc.open('replace');
    doc.write(html);
    doc.close();
    return doc;
  }

  function displayDog(dog) {
    cachePage();
    document.title = dog.name;
    document.documentElement.replaceChild($(infoDoc.body).clone()[0], document.body);

    window.history.pushState({}, '', '/favorites/' + dog.id);
    console.log(infoDoc);

    window.scrollTo(0, 0);

    PageSetup();

    $('#back-link').click(function() {
      console.log('back');
      restoreCachedPage();
      return false;
    });

    $('#main-header-title').text(dog.name);
    $('.favorite-name').text(dog.name);
    $('.favorite-age-sex').text(dog.age + " " + dog.sex);
    $('.favorite-breed').text(dog.breeds[0]);
    $('.favorite-description').append($(dog.description));
    $('.favorite-image').append($('<img src="' + dog.photoUrls[0] + '" />'));

    $('.breeder-name').text(lookupShelter(dog.organization.id));
    $('.breeder-email').text(dog.organization.email);
    $('.breeder-address').append($('<div>123 Avenue St.<br/>Pittsburgh, PA 15127</div>'));
    $('.breeder-phone').text('412-555-9556');
  }

  result = {
    popInfo: function(dog) {
      displayDog(dog);
    }
  };

  return result;
})();
