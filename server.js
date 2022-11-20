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

db.defaults({ art:[], light: [],bgm: [] }).write()


const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, req.body.order + path.extname(file.originalname));
    if (file.fieldname == 'image') {
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
    } else {
      if (db.get('bgm').filter({idx: Number(req.body.order)}).value().length == 0) {
        db.get('bgm').push({
          idx: Number(req.body.order),
          url: req.body.order + path.extname(file.originalname),
          title: file.originalname,
          play : true
        }).write();
      } else {
        db.get('bgm')
        .find({ idx: Number(req.body.order) })
        .assign({ url: req.body.order + path.extname(file.originalname), title: file.originalname})
        .write()
      }
    }
  },
  destination: function (req, file, cb) {
    console.log(file)
    if (file.fieldname == 'image') {
      cb(null, 'public/images')
    } else {
      cb(null, 'public/bgm')
    }
  },
})
/*
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("목적지");
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    console.log("파일 이름");
    console.log(req);
    console.log(file);
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

*/
/*
var bgmUpload = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/bgm')
  },
  filename: function (req, file, cb) {
    console.log("브금 업로드 2");
    cb(null, req.body.order + path.extname(file.originalname));
    console.log(req.body.order + path.extname(file.originalname));
    if (db.get('bgm').filter({idx: 0}).value().length == 0) {
      db.get('bgm').push({
        idx: 0,
        url: req.body.order + path.extname(file.originalname),
        play : true
      }).write();
      console.log("브금 업로드 3-1");
    } else {
      db.get('bgm')
      .find({ idx: 0 })
      .assign({ url: req.body.order + path.extname(file.originalname)})
      .write()
      console.log("브금 업로드 3-2");
    }
  }
})
*/
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

app.post('/bgm', upload.single('audio'), (req, res) => {
  console.log(req.file);
  res.sendFile(__dirname + '/index.html');
})

app.post('/light', (req, res) => {
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
app.post('/bgmplay', (req, res) => {
  db.get('bgm')
      .find({ idx: 0 })
      .assign({ play: req.body.play})
      .write()
})

app.get('/data', function (req, res) {
  const result = {
    art: db.get('art').value(),
    light: db.get('light').value(),
    bgm: db.get('bgm').value()
  };
  res.send(result);
});