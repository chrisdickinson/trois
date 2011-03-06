var http = require('http'),
    routes = require('./routes').routes;

var server = http.createServer(routes.root());

exports.serve = function(on) {
  server.listen(8080);
};

