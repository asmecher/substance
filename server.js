var express = require('express');
var path = require('path');
var glob = require('glob');
var browserify = require('browserify');
var sass = require('node-sass');
var PORT = process.env.PORT || 4201;
var app = express();

var config = require('./doc/config.json');
var generate = require('./doc/generator/generate');

// use static server
app.use('/docs', express.static(path.join(__dirname, 'doc/assets')));
app.use('/docs/fonts', express.static(path.join(__dirname, 'node_modules/font-awesome/fonts')));

app.use('/i18n', express.static(path.join(__dirname, 'i18n')));

app.get('/docs/documentation.json', function(req, res) {
  var nodes = generate(config);
  res.json(nodes);
});

app.get('/docs/app.js', function (req, res) {
  browserify({ debug: true, cache: false })
    .add(path.join(__dirname, 'doc', 'app.js'))
    .bundle()
    .on('error', function(err){
      console.error(err.message);
      res.send('console.log("'+err.message+'");');
    })
    .pipe(res);
});

var handleError = function(err, res) {
  console.error(err);
  res.status(400).json(err);
};

var renderSass = function(cb) {
  sass.render({
    file: path.join(__dirname, 'doc', 'app.scss'),
    sourceMap: true,
    outFile: 'app.css',
  }, cb);
};


app.get('/docs/app.css', function(req, res) {
  renderSass(function(err, result) {
    if (err) return handleError(err, res);
    res.set('Content-Type', 'text/css');
    res.send(result.css);
  });
});

app.get('/docs/app.css.map', function(req, res) {
  renderSass(function(err, result) {
    if (err) return handleError(err, res);
    res.set('Content-Type', 'text/css');
    res.send(result.map);
  });
});

// Test suite
app.get('/test/test.js', function (req, res, next) {
  glob("test/**/*.test.js", {}, function (er, testfiles) {
    if (er || !testfiles || testfiles.length === 0) {
      console.error('No tests found.');
      res.send('500');
    } else {
      // console.log('Found test files:', testfiles);
      browserify({ debug: true })
        .add(path.join(__dirname, 'test', 'test-globals.js'))
        .add(testfiles.map(function(file) {
          return path.join(__dirname, file);
        }))
        .bundle()
        .on('error', function(err){
          console.error(err.message);
          res.status(500).send('console.log("'+err.message+'");');
          next();
        })
        .pipe(res);
    }
  });
});

// Provide static routes for testing
// for accessing test/index.html and for fixtures
// NOTE: '/base' is necessary to be compatible with karma
app.use('/test', express.static(__dirname + '/test'));
app.use('/base/test', express.static(__dirname + '/test'));

app.listen(PORT);
console.log('Server is listening on %s', PORT);
console.log('To view the docs go to http://localhost:%s/docs', PORT);
console.log('To run the test suite go to http://localhost:%s/test', PORT);
