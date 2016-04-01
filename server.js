var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var config = require('./webpack.config');

var app = new (require('express'))();
var port = 8080;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));

app.use(function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, function(err) {
  err ? console.error(err) : console.info('Listening on port %s. Open localhost:%s', port, port);
});
