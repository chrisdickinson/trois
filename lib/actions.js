var fs = require('fs'),
    path = require('path'),
    querystring = require('querystring'),
    html = fs.readFileSync(path.join(__dirname, 'template.html')),
    formidable = require('formidable'),
    stores = require('./storage');

error_html = fs.readFileSync(path.join(__dirname, '500.html'));

html.format = function(obj) {
  return this.toString().replace(/\{\{\s*([\w\d]+?)\s*\}\}/g, function(all, el) {
    return obj[el] || '';
  });
};

var iframe = function(req, resp, name) {
  var qs = querystring.parse(req.path, true),
      filename = name || qs.file;

  resp.writeHead(200, {'Content-Type':'text/html'});
  resp.end(html.format({
    filename:filename
  }));
};

var upload = function(req, resp) {
  var form = new formidable.IncomingForm(),
      bucket = null,
      done = false;

  form.on('field', function(name, value) {
    if(name === 'key') {
      bucket = stores.get(value);
    }
    !bucket && (resp.writeHead(403, {'Content-Type':'text/html'}), resp.end());
  });

  form.on('fileBegin', function(name, file) {
    // accept one, and only one file.
    if(done) return;

    path.exists(file.path, function(exists) {
      if(exists) {
        done = true;
        var interval = setInterval(function() {
          if(bucket) {
            clearInterval(interval);
            bucket.startUpload(file).on('ready', function(filename) {
              bucket.upload(filename, file).on('end', function(err, s3resp) {
                if(err) {
                  resp.writeHead(500, {'Content-Type':'text/html'});
                  resp.end(error_html); 
                  fs.unlink(path.join(file.path, file.name), function(){});
                } else {
                  iframe(req, resp, filename);              
                }
              });
            });
          }
        }, 10);
      } else {
        fs.mkdir(file.path, 0755, arguments.callee);
      }
    });
  });

  form.parse(req);
};

exports.iframe = iframe;
exports.upload = upload;
