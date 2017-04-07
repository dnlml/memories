$(function () {
  var socket = io(); // load the socket.io-client
  var $ul = $('[data-mosaic]');
  var $imageContainer = $('[data-full-image]');
  var $imageWhiteboard = $imageContainer.find('[data-full-image-whiteboard]');
  var queue = [];

  // var _queue = new Proxyqueue, {
  //   apply: function(target, thisArg, argumentsList) {
  //     return thisArg[target].apply(this, argumentList);
  //   },
  //   deleteProperty: function(target, property) {
  //     // remove element from array
  //     return true;
  //   },
  //   set: function(target, property, value, receiver) {
  //     target[property] = value;
  //     if (typeof value === typeof '') {
  //       appendImage();
  //     }
  //     return true;
  //   }
  // });

  var isProcessingQueue;

  function processQueue() {
    if (!queue.length || isProcessingQueue) {
      return;
    }

    isProcessingQueue = true;
    const lastInQueue = queue[queue.length - 1];

    processImage(lastInQueue, () => {
      queue.splice(-1, 1);
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
    }, 5000);

    setTimeout(function () {
      callback();
    }, 5400);
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

    // setTimeout(function () {
    //   $imageWhiteboard.text('');
    // }, 400);
  }

  // function appendImage() {
  //   for(img of queue) {
  //     $imageWhiteboard.append('<img src="' + img + '">');
  //     openImageContainer();

  //     setTimeout(function () {
  //       closeImageContainer()
  //     }, 5400);
  //   }
  // }
});