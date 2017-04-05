$(function () {
  var socket = io();
  var $ul = $('[data-list]');

  socket.on('upload', function(data) {
    for (var img of data) {
      $ul.append('<li><img src="/uploads/' + img + '"></li>');
    }
  });
});