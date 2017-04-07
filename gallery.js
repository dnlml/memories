$(function () {
  var socket = io(); // load the socket.io-client
  var $ul = $('[data-mosaic]');
  var $imageContainer = $('[data-full-image]');
  var $imageWhiteboard = $imageContainer.find('[data-full-image-whiteboard]');
  var imagesToShow = [];

  var _imagesToShow = new Proxy(imagesToShow, {
    apply: function(target, thisArg, argumentsList) {
      return thisArg[target].apply(this, argumentList);
    },
    deleteProperty: function(target, property) {
      // remove element from array
      return true;
    },
    set: function(target, property, value, receiver) {
      target[property] = value;
      if (typeof value === typeof '') {
        appendImage();
      }
      return true;
    }
  });

  socket.on('thumbnails generated', function(data) {
    appendThumb(data);
    showFullscreen(data);
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
    _imagesToShow.push('/uploads/'+data);
  }

  function openImageContainer() {
    $imageContainer.addClass('visible');
  }

  function closeImageContainer() {
    $imageContainer.removeClass('visible');

    setTimeout(function () {
      $imageWhiteboard.text('');
      _imagesToShow.shift();
    }, 400);
  }

  function appendImage() {
    for(img of imagesToShow) {

      $imageWhiteboard.append('<img src="' + img + '">');
      openImageContainer();

      setTimeout(function () {
        closeImageContainer()
      }, 5400);
    }
  }
});