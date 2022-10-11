const path = require("path");
const express = require('express');
const multer = require('multer')
const app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images')
  },
  filename: function (req, file, cb) {
    console.log(req.body.order)
    cb(null, req.body.order + path.extname(file.originalname)) /
  }
})


const upload = multer({
  storage: storage
})

app.listen(8080, function () {
  console.log('Listening at 8080');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/art', function (req, res) {
  res.sendFile(__dirname + '/art.html');
});

app.post('/upload', upload.single('image'), (req, res) => {
  res.json(req.file)
  console.log(req.file)
})