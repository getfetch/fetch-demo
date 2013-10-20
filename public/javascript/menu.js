
$(function() {
  $('#main-menu').mmenu();
  $('#main-menu-link').click(function() {
    $('#main-menu').trigger('open');
  });

  $('#filter-settings').mmenu({
    position: 'right'
  });
  $('#filter-link').click(function() {
    $('#filter-settings').trigger('open');
  });

  $('#size').buttonset();
});
