const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');
const config = require('./config');
const bodyParser = require('body-parser');

const requiresAllowedOrigin = require('./lib/allowed_origins_middleware');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    if (config.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

// app.use(bodyParser.text());
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
app.use(requiresAllowedOrigin);
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
