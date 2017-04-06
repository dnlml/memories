var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var forEach = require('lodash/forEach');
var sharp = require('sharp');

var filesPaths = [];

app.use(express.static(path.join(__dirname, '/')));

http.listen(4000, function(){
  console.log('Server started, listening on http://localhost:4000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/gallery', function(req, res){
  res.sendFile(__dirname + '/gallery.html');
  readFiles();
});

app.post('/uploads', function(req, res){
  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');
  form.uploadThumbs = path.join(__dirname, '/thumbs');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name), function (err) {
      if (err) throw err;
    });
    sharp(path.join(form.uploadDir, file.name))
        .resize(100,100)
        .toBuffer()
        .then( function(data) {
          fs.writeFile(path.join(form.uploadThumbs, file.name), data, function(err) {
            if (err) throw err;
            console.log('Thumbnail generated');
            io.emit('thumbnails generated', file.name);
          });
        });
  });

  // log any errors that occur
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
  socket.on('upload', function(data){
    io.emit('upload completed', data);
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
      io.emit('load', filesPaths);
      filesPaths = [];
    });
  });
}

function extensionCheck(file) {
  var myRe = new RegExp('^(.*\.((jpg|jpeg|png)$))?[^.]*$', 'igm');
  return myRe.exec(file);
}