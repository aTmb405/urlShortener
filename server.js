'use strict';
require('dotenv').config()
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var validUrl = require('valid-url');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

app.use(cors());

/** this project needs to parse POST bodies **/
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

var urlSchema = new mongoose.Schema({
  originalURL: {
    type: String,
    unique: true
  },
  shortURL: {
    type: String,
    unique: true
  }
});

var URL = mongoose.model('URL', urlSchema);


app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get("/api/shorturl/:shortURL", function(req, res) {
  URL.findOne({shortURL: req.params.shortURL}, function(err, url) {
    if(err) {
      console.log(err);
    } else {
      console.log("Redirecting to " + url.originalURL)
      res.redirect(url.originalURL);
    }
  });
});

  
// your first API endpoint... 
app.post("/api/shorturl/new", function (req, res, next) {
  if (!req.body.url.includes("http")) {
    var url = "http://" + req.body.url
  } else {
    var url = req.body.url;
  }
  var short = shortid.generate();
  var newUrl = {originalURL: url, shortURL: short};
  
  if (validUrl.isUri(url)){
    URL.create(newUrl, function(err, newlyCreated){
      if(err){
          console.log(err);
      } else {
          console.log(newlyCreated);
      }
    });
    res.json(newUrl);
  } else {
    res.json({isURL: "NO"});
  }
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});