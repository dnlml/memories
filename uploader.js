$(function () {
  var $inputEl = $('#m');
  var socket = io();
  var formData;
  var fileUploaded;
  var myRe = new RegExp('\.[0-9a-z]+$', 'igm');;
  var fileName;
  var file;

  $inputEl.on('change', function () {
    // TODO check multiple upload from differente devices
    // TODO check upload of the same file
    var files = $inputEl.get(0).files;
    var filesLength = files.length;
    if (filesLength > 0) {
      formData = new FormData();
      fileUploaded = [];
      for (var i = 0; i < filesLength; i++) {
        file = files[i];
        fileName = Date.now()+'_'+i+'_'+file.name;
        formData.append('uploads[]', file, fileName);
        fileUploaded.push(fileName);
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