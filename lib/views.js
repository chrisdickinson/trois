var actions = require('./actions'),
    upload = actions.upload,
    iframe = actions.iframe,
    fs = require('fs'),
    path = require('path'),
    client_js = fs.readFileSync(path.join(__dirname, 'client.cjs'));

exports.client_js = function(req, resp) {
  resp.writeHead(200, {'Content-Type':'text/javascript'});
  resp.end(client_js);
};

exports.xdu_upload = function(req, resp) {
  req.method === 'POST' ?
    upload(req, resp) :
    iframe(req, resp);
};
