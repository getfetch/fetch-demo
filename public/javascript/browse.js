var PetBrowser = (function() {

  var result;

  function loadDogs(dogs) {
    var breeds = [];
    var $template = $('#pet-template');

    $.each(dogs, function(i, dog) {

      $.each(dog.breeds, function(i, breed) {
        if($.inArray(breed, breeds) == -1) {
          breeds.push(breed);
        }
      });

      var $dog = $template.clone();
      $dog.data('object', dog);

      $dog.attr('style', '');
      $dog.attr('id', '');

      $dog.find('.pet-name').text(dog.name);

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
  }

  var filter = {
    sex: null,
    age: null,
    size: null,
    breed: 'any'
  };

  function matchesFilter(dog) {
    var matches = 
      (filter.size && dog.size != filter.size) ||
      (filter.sex && dog.sex != filter.sex) ||
      (filter.age && dog.age != filter.age) ||
      (filter.breed != 'any' && $.inArray(filter.breed, dog.breeds))
      ;

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

    console.log(filter);

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
      result.popInfo($(this).parents('.pet').data('object'));
      return false;
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
  };

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

  function restoreCachedPage() {
    document.title = pageCache.title;
    document.documentElement.replaceChild(pageCache.body, document.body);
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

    console.log(infoDoc);

    window.scrollTo(0, 0);

    PageSetup();

    $('#back-link').click(function() {
      console.log('back');
      restoreCachedPage();
      return false;
    });

    $('#main-header-title').text(dog.name);
    $('.pet-name').text(dog.name);
    $('.pet-age-sex').text(dog.age + " " + dog.sex);
    $('.pet-breed').text(dog.breeds[0]);
    $('.pet-description').append($(dog.description));
    $('.pet-image').append($('<img src="' + dog.photoUrls[0] + '" />'));

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
