const path = require("path");
const express = require('express');
const multer = require('multer')
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { Console } = require("console");
var fs = require('fs');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ art:[], light: {} }).write()

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.order + path.extname(file.originalname));
    if (db.get('art').filter({idx: Number(req.body.order)}).value().length == 0) {
      db.get('art').push({
        idx: Number(req.body.order),
        url: req.body.order + path.extname(file.originalname),
        show : true
      }).write();
    } else {
      db.get('art')
      .find({ idx: Number(req.body.order) })
      .assign({ url: req.body.order + path.extname(file.originalname)})
      .write()
    }
  }
})




const upload = multer({
  storage: storage
})
 
fs.readdir('./public/images', function(error, filelist){
  return filelist;
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
  res.sendFile(__dirname + '/art.html');
})

app.post('/show', (req, res) => {
  db.get('art')
      .find({ idx: Number(req.body.idx) })
      .assign({ show: req.body.show})
      .write()
})


app.get('/data', function (req, res) {
  const result = {
    art: db.get('art').value(),
    light: db.get('light').value()
  };
  res.send(result);
});