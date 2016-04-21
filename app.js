var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

//mongoose connection
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/mixtapes', function(err, res) {
//     if(err) throw err;
//     console.log('Connected to Database');
// });

mongoose.connect('mongodb://victor:password@ds013931.mlab.com:13931/heroku_qrq235bh');


//product controller with mongoose conection
var product_controller = require('./controllers/products')(mongoose);

var app = express();

// views engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// instance of router
var router = express.Router();

// home page
router.get('/', function(req, res) {
    //res.render('index', { title: 'Express' }); 
    res.sendfile('./public/js/app/templates/index.html');
});

//routes
router.get('/api/products', function(req, res, next) {
    product_controller.findAll(res);
});
router.get('/api/product/:id', function(req, res, next) {
    product_controller.findByOne(req,res);
});
router.post('/api/product/save', function(req, res, next) {
    product_controller.save(req,res);
});
router.post('/api/comment/save', function(req, res, next) {
    //get ip of client
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    product_controller.saveComment(req,res, ip);
});
router.get('/api/comments', function(req, res, next) {
    product_controller.findAll(res);
});

// apply the routes to our application
app.use('/', router);


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
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(PORT);
console.log('Listening on port ' + PORT); 
module.exports = app;
