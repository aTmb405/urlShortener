'use strict';
require('dotenv').config()
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dns = require('dns');
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

  
// your first API endpoint... 
app.post("/api/shorturl/new", function (req, res, next) {
  res.json({
    originalURL: 'hello API',
    shortURL: shortid.generate
  });
}, function (req, res) {
  
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});