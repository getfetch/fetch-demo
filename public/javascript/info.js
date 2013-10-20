var Info = (function() {
  var result;

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
    console.log
    pageCache = {
      title: document.title,
      body: document.body,
      url: document.location.href,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
  }

  $(window).on('popstate', function(e) {
    if(e.originalEvent.state && e.originalEvent.state.info) {
      restoreCachedPage();
    }
  });

  function restoreCachedPage() {
    if(!pageCache) {
      return;
    }

    document.title = pageCache.title;
    document.documentElement.replaceChild(pageCache.body, document.body);

    window.history.replaceState({}, '', pageCache.url);

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
    console.log('Displaying: ', dog);

    cachePage();
    document.title = dog.name;
    document.documentElement.replaceChild($(infoDoc.body).clone()[0], document.body);

    window.history.pushState({ info: true }, '', '/browse/' + dog.id);
    console.log(infoDoc);

    window.scrollTo(0, 0);

    PageSetup();

    $('#back-link').click(function() {
      console.log('back');
      restoreCachedPage();
      return false;
    });

    $('#main-header-title').text(dog.name);
    $('.pet').addClass(dog.options.join(' '));
    $('.pet-name').text(dog.name);
    $('.pet-age-sex').text(dog.age + " " + dog.sex);
    $('.pet-breed').text(dog.breeds[0]);
    $('.pet-description').append($(dog.description));
    $('.pet-image').append($('<img src="' + dog.photoUrls[0] + '" />'));

    $('.breeder-name').text(PetBrowser.lookupShelter(dog.organization.id));
    $('.breeder-email').text(dog.organization.email);
    $('.breeder-address').text(dog.organization.address);
    $('.breeder-phone').text(dog.organization.phone);
  }

  result = {
    popInfo: function(dog) {
      displayDog(dog);
    }
  };

  return result;
})();
