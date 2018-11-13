var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv').config();
var cors = require('cors');

let bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
let apiRouter = require('./routes/api');

var app = express();

// app.use(bodyParser.text());
app.use(cors());
app.use(logger('dev'));
app.use(express.json({ type: (req) => {
  // if () {
  //
  // }true
    return true;
  }
}));
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
