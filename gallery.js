$(function () {
  var socket = io();

  socket.on('upload', function(data) {
    console.log(data);
  });
});