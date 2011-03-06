var http = require('http'),
    actions = require('./actions'),
    upload = actions.upload,
    iframe = actions.iframe;

var server = http.createServer(function(req, resp) {
  req.method === 'POST' ?
    upload(req, resp) :
    iframe(req, resp);
});

server.listen(8080);
