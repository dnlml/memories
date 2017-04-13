$(function () {
  const MAX_THUMBS = 30;
  const DURATION = 7000;
  const INTERVALL = 60000 * .5;
  var socket = io(); // load the socket.io-client
  var $ul = $('[data-mosaic]');
  var $imageContainer = $('[data-full-image]');
  var $imageWhiteboard = $imageContainer.find('[data-full-image-whiteboard]');
  var queue = [];

  var isProcessingQueue;

  socket.on('thumbnails generated', function(data) {
    appendThumb(data);
    queue.push(data);
    processQueue();
  });

  socket.on('load', function(data) {
    appendThumb(data);
    randomImage();
  });

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
    }, DURATION);

    setTimeout(function () {
      callback();
    }, DURATION+400);
  }

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

  function randomImage() {
    console.log('randomImage');

    var $imgs = $ul.find('img');
    var imgCounter = $imgs.length;
    var randomNumber;
    var randomImg;

    window.setInterval(function() {
      randomNumber = Math.ceil(Math.random() * imgCounter) - 1;
      randomImg = $($imgs[randomNumber]).attr('src');
      randomImg = randomImg.replace('/thumbs/','');

      if (!isProcessingQueue) {
        queue.push(randomImg);
        processQueue();
      }
    }, INTERVALL);
  }
});