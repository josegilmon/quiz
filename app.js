var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('method'));
app.use(express.static(path.join(__dirname, 'public')));

// MW para comprobar si la sesión de usuario ha caducado, en cuyo caso, la borramos
app.use( function (req, res, next) {
	// Definimos las variables para comprobar la sesión:
	//		fecha actual, la de último acceso, la diferencia entre ambas y el número de milisegundos del tiempo límite (2 minutos)
	var actualDate = new Date().getTime(),
		lastAccess = req.session.lastAccess || 0,
		elapsedTime = actualDate - lastAccess,
		limitTime = 2 * 60 * 1000;

	if (elapsedTime > limitTime) {
		// eliminamos la sesión del usuario
		delete req.session.user;
	}
	// Guardamos el nuevo acceso del usuario
	req.session.lastAccess = new Date().getTime();

	next();
});

app.use( function (req, res, next) {
	if ( !req.path.match(/\/login|\/logout/) ) {
		req.session.redir = req.path;
	}

	res.locals.session = req.session;
	next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err,
			errors: []
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {},
		errors: []
	});
});


module.exports = app;
