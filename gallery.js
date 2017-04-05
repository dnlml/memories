$(function () {
  var socket = io();
  var $ul = $('[data-list]');

  socket.on('upload', function(data) {
    appendImg(data);
  });

  socket.on('load', function(data) {
    appendImg(data);
  });

  function appendImg(data) {
    for (var img of data) {
      $ul.append('<li><img src="/thumbs/' + img + '"></li>');
    }
  }
});