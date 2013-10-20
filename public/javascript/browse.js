(function() {

  function load_dogs(dogs) {
    var $template = $('#pet-template');

    $.each(dogs, function(i, dog) {
      var $dog = $template.clone();
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

      console.log($dog);
      $('.pet-container').append($dog);
    });
  }

  $.getJSON('/data/dogs.json')
  .done(function(data) {
    $(function() {
      load_dogs(data);
    });
  });
})();
