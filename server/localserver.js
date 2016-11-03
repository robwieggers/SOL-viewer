var jsonServer = require('json-server');
var fs   = require('fs');
var path = require('path');
var geometryPath = './specs/stubs/geometries';

var geometries = scanDir(geometryPath);


function isJson(file) {
  return /\.json(z)?$/.test(file);
}

function containsJson(dir) {
  var files = fs.readdirSync(dir);

  if (files) {
    files = files.filter(isJson);
  }
  return files.length;
}

function scanDir(dir) {
  var geometries = fs.readdirSync(dir);

  var geometryPaths = geometries.map(function(el) { return dir + '/' + el; });
  
  if (geometryPaths) {
    geometryPaths = (geometryPaths).filter(containsJson);
  }
  geometries = geometryPaths.map(function(el) { return el.replace(/^.*[\\\/]/, '')});
  
  console.log('\nList of available Grids:');
  geometries.map(function(geometry) {
    console.log('- ' + geometry);
  });
  console.log('\n\n');

  return geometries;
}

/**
 * Send Grid
 */
function sendGrid(res, query, url) {
  var fileName;
  var id;

  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  if (url) {
    url = url.split('/')[3];
    id = parseInt(url[url.length - 1]);
    fileName = geometryPath + geometries[id % geometries.length] + '/b2grid.json';
    console.log('request geometry ' + id, fileName);
  }

  fs
    .createReadStream(path.resolve(process.cwd(), fileName))
    .pipe(res);
}

module.exports = function(port) {
  var server = jsonServer.create();

  server.use(jsonServer.defaults());


  server.get('/api/geometries/list', function(req, res) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(geometries));
    res.end();
  });

  // all urls will start with /api/
  //server.use('/api/', router);

  return server.listen(port);
};
