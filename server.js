var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var forEach = require('lodash/forEach');
var sharp = require('sharp');
var isGalleryUp = false;
var filesPaths = [];

app.use(express.static(path.join(__dirname, '/')));

http.listen(4000, function(){
  console.log('Server started, listening on http://localhost:4000');
  fs.open('uploads', 'r', function(err,fd) {
    if (err) {
      console.log('Upload folder does not exist');
      fs.mkdir('uploads', function() {
        console.log('Creating folder /uploads');
      });
    }
  });

  fs.open('thumbs', 'r', function(err,fd) {
    if (err) {
      console.log('Thumbs folder does not exist');
      fs.mkdir('thumbs', function() {
        console.log('Creating folder /thumbs');
      });
    }
  });
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/gallery', function(req, res){
  if(!isGalleryUp) {
    isGalleryUp = true;
    res.sendFile(__dirname + '/gallery.html');
    readFiles();
  } else if(isGalleryUp) {
    res.sendFile(__dirname + '/404.html');
  }
});

app.post('/uploads', function(req, res){
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '/uploads');
  form.uploadThumbs = path.join(__dirname, '/thumbs');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name), function (err) {
      if (err) throw err;
    });
    setTimeout(
      function() {
        sharp(path.join(form.uploadDir, file.name))
        .rotate()
        .resize(100,100)
        .toBuffer()
        .then( function(data) {
          fs.writeFile(path.join(form.uploadThumbs, file.name), data, function(err) {
            if (err) throw err;
            console.log('Thumbnail generated');
            io.emit('thumbnails generated', file.name);
          });
        }).catch(function (err) {
          console.log("Sharp", err);
      });
    },100);
  });

  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

// Listen on the connection event for incoming sockets
io.on('connection', function(socket) {
  console.log('New connection established');

  socket.on('disconnect', function(){
    console.log('Socket disconnected');
  });
});

function readFiles() {
  console.log('Reading files');
  fs.readdir('./uploads/', function(err, files) {
    files.forEach(file => {
      if (extensionCheck(file)) {
        filesPaths.push(file);
      }
    });

    io.on('connection', function(socket) {
      socket.emit('load', filesPaths);
      filesPaths = [];
    });
  });
}

function extensionCheck(file) {
  var myRe = new RegExp('^(.*\.((jpg|jpeg|png)$))?[^.]*$', 'igm');
  return myRe.exec(file);
}