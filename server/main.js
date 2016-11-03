var express    = require('express'),
    path       = require('path'),
    localServer = require('./localserver'),
    opn        = require('opn'),
    httpProxy  = require('http-proxy');

var app = express(),
    proxy = httpProxy.createProxyServer();

var isProduction = process.env.NODE_ENV === 'production',
    port = 9001,
    portLive = 9002,
    srcPath = path.resolve(__dirname, '..', 'src'),
    localServerUrl = ('http://localhost:' + portLive)

app.use(express.static(srcPath));

if (localServerUrl) {
  localServer(portLive);
  app.all('/api/*', function (req, res) {
    // console.log('Request ', req.url, ' redirecting to ',
    //   localServer + req.url);
    proxy.web(req, res, {
      target: localServerUrl
    });
  });
}

proxy.on('error', function() {
  console.log('Could not connect to proxy, please try again...');
});

app.listen(port, function() {
  console.log('Server running on port: ' + port);
  opn('http://localhost:' + port);
});
