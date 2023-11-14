const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
const session = require('express-session');

require('./config/passport')(passport);

app.use(cookieParser());


const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const patientsRouter = require('./routes/patients');
const accountsRouter = require('./routes/accounts');
const usersRouter = require('./routes/users');

require('dotenv').config({path: __dirname + '/.env'});

mongoose.connect(process.env['DATABASE']);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// passport stuff
app.use(session({
  secret: 'devkey',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/patients', patientsRouter);
app.use('/accounts', accountsRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;