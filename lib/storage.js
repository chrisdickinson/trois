var fs = require('fs'),
    path = require('path'),
    knox = require('knox'),
    EE = require('events').EventEmitter,
    file = fs.readFileSync(path.join(process.cwd(), process.argv.slice(-1)[0])),
    json = JSON.parse(file);

var buckets = {};

var Bucket = function(info) {
  this.info = info;
  this.interface = knox.createClient(this.info);
};

Bucket.prototype.upload = function(filename, file) {
  var ee = new EE();
  try {
    this.interface.putStream(
      fs.createReadStream(file.path), 
      filename, 
      ee.emit.bind(ee, 'end')
    );
  } catch(err) {
    setTimeout(function() { ee.emit('end', new Error('we cannot win')); });
  }
  return ee;
};

Bucket.prototype.startUpload = function(file) {
  var ee = new EE(),
      now = new Date();

  now.Y = now.getFullYear;
  now.m = function() {
    return now.getMonth() + 1;
  };
  now.d = now.getDate;

  var name = this.info.upload_to || '';
  name = path.join(name.replace(/%(\w{1})/g, function(full, repl) {
    return now[repl]();
  }), file.name);

  var pleasePut = function(fileName) {
    this.interface.head(fileName).on('response', function(res) {
      if(res.statusCode === 200) {
        var bits = fileName.split('.');

        bits.length > 1 && 
          (bits[bits.length-2] += '_') ||
          (bits[0] += '_');

        pleasePut(bits.join('.'));
      } else {
        ee.emit('ready', fileName);
      }
    }).end();
  }.bind(this);

  pleasePut(name);
  return ee;
};

exports.get = function(key) {
  return buckets[key];
};

exports.load = function() {
  Object.keys(json.targets).forEach(function(key) {
    buckets[key] = new Bucket(json.targets[key]);
  });

};

exports.load();
