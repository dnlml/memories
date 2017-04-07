$(function () {
  var socket = io(); // load the socket.io-client
  var $inputEl = $('#m');
  var $progressBar = $('.progress-bar');
  var formData;
  var fileUploaded;
  var fileName;
  var file;

  $inputEl.on('change', function () {
    $progressBar.text('0%').width('0%');
    $('.progress').addClass('visible');
    var $el = $(this);
    var files = $el.get(0).files;
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
        setTimeout(function() {
          $('.progress').removeClass('visible');
        }, 1000);
        setTimeout(function() {
          $progressBar.text('').width('0%');
        }, 1400);
      },
      xhr: function() {
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', function(evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            $progressBar.text(percentComplete + '%').width(percentComplete + '%');
            if (percentComplete === 100) {
              $progressBar.html('Done');
            }
          }
        }, false);
        return xhr;
      }
    });
  });
});