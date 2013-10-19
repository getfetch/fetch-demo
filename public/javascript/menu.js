
$(function() {
  $('#main-menu').mmenu();
  $('#main-menu-link').click(function() {
    $('#main-menu').trigger('open');
  });
});
