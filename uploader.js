$(function () {
  var $inputEl = $('#m');
  var socket = io();
  var formData;

  $inputEl.on('change', function () {
    var files = $inputEl.get(0).files;
    if (files.length > 0) {
      formData = new FormData();
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        formData.append('uploads[]', file, file.name);
      }
    }
    $inputEl.val('');
  });

  $('form').submit(function(e){
    e.preventDefault();
    console.log(formData);
    // SEND FILES
    $.ajax({
      url: '/uploads',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(){
        // TODO Pass the list of files uploaded to the gallery
        socket.emit('upload', formData);
      }
    });
    return;
  });
});