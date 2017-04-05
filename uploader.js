$(function () {
  var $inputEl = $('#m');
  var socket = io();
  var formData;
  var fileUploaded;

  $inputEl.on('change', function () {
    // TODO change name of files to avoid conflicts
    // TODO check multiple upload from differente devices
    // TODO check upload of the same file
    var files = $inputEl.get(0).files;
    if (files.length > 0) {
      formData = new FormData();
      fileUploaded = [];

      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        formData.append('uploads[]', file, file.name);
        fileUploaded.push(file.name);
      }
    }
    $inputEl.val('');
  });

  $('form').submit(function(e){
    e.preventDefault();

    // SEND FILES
    $.ajax({
      url: '/uploads',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(){
        socket.emit('upload', fileUploaded);
        $inputEl.val('');
      }
    });
    return;
  });
});