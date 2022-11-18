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
app.use(express.urlencoded({ extended: false }));

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ art:[], light: [] }).write()

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
        show : true,
        frame : false
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
  if (db.get('light').filter({idx: 0}).value().length == 0) {
    db.get('light').push({idx:0, color : "#ffffff" ,range : 12, angle : 165}).write();
  }
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.single('image'), (req, res) => {
  res.sendFile(__dirname + '/index.html');
})
app.post('/light', (req, res) => {
  console.log(req.body.light_color);

  db.get('light')
  .find({ idx:0 })
  .assign({color : req.body.light_color ,range : Number(req.body.light_range), angle : Number(req.body.light_angle)})
  .write();
  res.sendFile(__dirname + '/index.html');
})

app.post('/show', (req, res) => {
  db.get('art')
      .find({ idx: Number(req.body.idx) })
      .assign({ show: req.body.show})
      .write()
})
app.post('/frame', (req, res) => {
  db.get('art')
      .find({ idx: Number(req.body.idx) })
      .assign({ frame: req.body.frame})
      .write()
})

app.get('/data', function (req, res) {
  const result = {
    art: db.get('art').value(),
    light: db.get('light').value()
  };
  res.send(result);
});