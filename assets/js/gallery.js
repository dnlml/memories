$(function () {
  const MAX_THUMBS = 30;

  var socket = io(); // load the socket.io-client
  var $ul = $('[data-mosaic]');
  var $imageContainer = $('[data-full-image]');
  var $imageWhiteboard = $imageContainer.find('[data-full-image-whiteboard]');
  var queue = [];

  var isProcessingQueue;

  function processQueue() {

    if (!queue.length || isProcessingQueue) {
      return;
    }

    isProcessingQueue = true;
    const lastInQueue = queue[0];
    processImage(lastInQueue, () => {
      queue.splice(0, 1);
      isProcessingQueue = false;
      processQueue();
    })
  }

  function processImage(filename, callback = function(){}) {
    let image = new Image();
    image.src = '/uploads/' + filename;

    $imageWhiteboard.text('');
    $imageWhiteboard.append(image);
    openImageContainer();

    setTimeout(function() {
      closeImageContainer();
    }, 7000);

    setTimeout(function () {
      callback();
    }, 7400);
  }

  socket.on('thumbnails generated', function(data) {
    appendThumb(data);
    queue.push(data);
    processQueue();
  });

  socket.on('load', function(data) {
    appendThumb(data);
  });

  function appendThumb(data) {
    if (typeof data === 'string') {
      $ul.append('<li><img src="/thumbs/' + data + '"></li>');
    } else {
      for (var img of data) {
        $ul.append('<li><img src="/thumbs/' + img + '"></li>');
      }
    }
    cleanGallery();
  }

  function cleanGallery() {
    if ($ul.children().length > MAX_THUMBS) {
      $ul.children(':first-of-type').remove();
      cleanGallery();
    }
  }

  function showFullscreen(data) {
    pushImage(data);
  }

  function pushImage(data) {
    queue.push('/uploads/'+data);
  }

  function openImageContainer() {
    $imageContainer.addClass('visible');
  }

  function closeImageContainer() {
    $imageContainer.removeClass('visible');
  }
});