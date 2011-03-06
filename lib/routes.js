var escaperoute = require('escaperoute'),
    url = escaperoute.surl,
    include = escaperoute.include,
    routes = escaperoute.routes;

exports.routes = routes('upload/views',
  url('^/xdu/$', 'xdu_upload', 'xdu_upload'),
  url('^/trois.js$', 'client_js', 'client_js')
);


