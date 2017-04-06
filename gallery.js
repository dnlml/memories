$(function () {
  var socket = io(); // load the socket.io-client
  var $ul = $('[data-list]');

  socket.on('thumbnails generated', function(data) {
    appendImg(data);
  });

  socket.on('load', function(data) {
    appendImg(data);
  });

  function appendImg(data) {
    if (typeof data === 'string') {
      $ul.append('<li><img src="/thumbs/' + data + '"></li>');
    } else {
      for (var img of data) {
        $ul.append('<li><img src="/thumbs/' + img + '"></li>');
      }
    }
  }

  function showFullscreen() {

  }
});