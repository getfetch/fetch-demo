
$(function() {
  $('#main-menu').mmenu();
  $('#main-menu-link').click(function() {
    $('#main-menu').trigger('open');
    return false;
  });

  $('#filter-settings').mmenu({
    position: 'right'
  });
  $('#filter-link').click(function() {
    $('#filter-settings').trigger('open');
    return false;
  });

  $('#size').buttonset();
  $('#age').buttonset();
  $('#distance').buttonset();
  $('#sex').buttonset();
});
