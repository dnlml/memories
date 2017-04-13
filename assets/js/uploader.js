$(function () {
  var socket = io(); // load the socket.io-client
  var $inputEl = $('#m');
  var $label = $('[for="m"]');
  var $caption = $('[data-caption]');
  var $progressBar = $('.progress-bar');
  var formData;
  var fileUploaded;
  var fileName;
  var file;
  var uploadedPhotos = getLocalStorage();


  if (!uploadedPhotos) {
    setLocalStorage();
  }

  if (uploadedPhotos >= 10) {
    obfuscateUpload();
  }

  $inputEl.on('change', function () {
    $progressBar.text('0%').width('0%');
    $('.progress').addClass('visible');
    var $el = $(this);
    var files = $el.get(0).files;
    var filesLength = files.length;
    if (filesLength > 0 && filesLength < 6) {
      formData = new FormData();
      fileUploaded = [];
      for (var i = 0; i < filesLength; i++) {
        file = files[i];
        fileName = Date.now()+'_'+i+'_'+file.name;
        formData.append('uploads[]', file, fileName);
        fileUploaded.push(fileName);
        incrementLocalStorage();
        if(getLocalStorage() >= 10) {
          obfuscateUpload();
          i = filesLength;
        }
      }
    } else {
      alert('Please select not more than 5 images');
      formData = undefined;
      $('.progress').removeClass('visible');
      return;
    }

    // Send files and update the loading bar
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

  function setLocalStorage() {
    window.localStorage.setItem("memories", 0);
  }

  function getLocalStorage() {
    return Number(window.localStorage.getItem("memories")) || false;
  }

  function incrementLocalStorage() {
    var i = getLocalStorage();
    i = i + 1;
    window.localStorage.setItem("memories", i);
  }

  function obfuscateUpload() {
    $caption.html('Thank you! <br> Nico and Gemma are super happy because you uploaded 10 photos <br> ❤');
    $label.css({'display': 'none'});
  }

});