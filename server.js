// ===========================================
// OPS STATUS
// 1.0.0
// Licensed under GPLv3
// ===========================================

global.PROCNAME = 'OPSSTATUS';
global.ROOTPATH = __dirname;
global.CORE_PATH = ROOTPATH + '/../core/';
global.IS_DEBUG = process.env.NODE_ENV === 'development';

// ----------------------------------------
// Load modules
// ----------------------------------------

global.winston = require(CORE_PATH + 'core-libs/winston')(IS_DEBUG);
winston.info('Ops Status is initializing...');

var appconfig = require(CORE_PATH + 'core-libs/config')('./config.yml');
global.db = require(CORE_PATH + 'core-libs/mongodb').init(appconfig);
global.red = require(CORE_PATH + 'core-libs/redis')(appconfig);

var _ = require('lodash');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var compression = require('compression');
var passport = require('passport');
var autoload = require('auto-load');
var expressValidator = require('express-validator');
var http = require('http');

global.lang = require('i18next');
var i18next_backend = require('i18next-node-fs-backend');
var i18next_mw = require('i18next-express-middleware');

var mw = autoload(CORE_PATH + '/core-middlewares');
var ctrl = autoload(path.join(__dirname, '/controllers'));

// ----------------------------------------
// Define Express App
// ----------------------------------------

global.app = express();

// ----------------------------------------
// Background Handler
// ----------------------------------------

var bgHandler = require('./libs/bghandler')(appconfig);

// ----------------------------------------
// Security
// ----------------------------------------

app.use(mw.security);

// ----------------------------------------
// Passport Authentication
// ----------------------------------------

var strategy = require(CORE_PATH + 'core-libs/auth')(passport, appconfig);
global.rights = require(CORE_PATH + 'core-libs/rights');

app.use(cookieParser());
app.use(session({
  name: 'opsstatus.sid',
  store: new redisStore({ client: red }),
  secret: appconfig.sessionSecret,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// ----------------------------------------
// Localization Engine
// ----------------------------------------

lang
  .use(i18next_backend)
  .use(i18next_mw.LanguageDetector)
  .init({
    load: 'languageOnly',
    ns: ['common'],
    defaultNS: 'common',
    saveMissing: false,
    supportedLngs: ['en', 'fr'],
    preload: ['en', 'fr'],
    fallbackLng : 'en',
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json'
    }
  });

// ----------------------------------------
// View Engine Setup
// ----------------------------------------

app.use(compression());

app.use(i18next_mw.handle(lang));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// ----------------------------------------
// Public Assets
// ----------------------------------------

app.use(express.static(path.join(__dirname, 'assets')));

// ----------------------------------------
// View accessible data
// ----------------------------------------

app.locals._ = require('lodash');
app.locals.moment = require('moment-timezone');
app.locals.appconfig = appconfig;
app.locals.appdata = require('./data.json');
app.use(mw.flash);

// ----------------------------------------
// Controllers
// ----------------------------------------

let routes = ctrl.routes();

app.use('/', ctrl.auth);

app.use('/', routes.dashboard());
app.use('/admin', mw.auth, routes.admin());

// ----------------------------------------
// Error handling
// ----------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: IS_DEBUG ? err : {}
  });
});

// ----------------------------------------
// Start HTTP server
// ----------------------------------------

winston.info('Starting HTTP server on port ' + appconfig.port + '...');

app.set('port', appconfig.port);
var server = http.createServer(app);
server.listen(appconfig.port);
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error('Listening on port ' + appconfig.port + ' requires elevated privileges!');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('Port ' + appconfig.port + ' is already in use!');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  winston.info('HTTP server started successfully! [RUNNING]');
});
