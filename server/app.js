const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const config = require('./config');
const bodyParser = require('body-parser');

const requiresAllowedOrigin = require('./lib/allowed_origins_middleware');
const requiresAccessKey = require('./lib/requires_access_key_middleware');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json({ type: (req) => true }));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(requiresAllowedOrigin);
app.use(requiresAccessKey);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
