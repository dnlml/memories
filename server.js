var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var forEach = require('lodash/forEach');

var filesPaths = []

app.use(express.static(path.join(__dirname, '/')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/gallery', function(req, res){
  res.sendFile(__dirname + '/gallery.html');
});

app.post('/uploads', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
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

io.on('connection', function(socket) {
  console.log('New connection established');
  socket.on('upload', function(data){
    io.emit('upload', data);
  });
});

http.listen(4000, function(){
  console.log('Server started, listening on http://localhost:4000');
});

// function readFiles() {
//   fs.readdir('./uploads/', function(err, files) {
//     files.forEach(file => {
//       filesPaths.push('/uploads/' + file);
//     });
//     console.log(files);
//   });
// }