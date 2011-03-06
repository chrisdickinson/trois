var escaperoute = require('escaperoute'),
    url = escaperoute.surl,
    include = escaperoute.include,
    routes = escaperoute.routes;

exports.routes = routes('upload/views',
  url('^/upload/$', 'upload', 'upload'),
);


