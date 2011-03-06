(function(exports, global, undefined) {
  var deleteHash = function(fn) {
    return function() {
      location.hash = '###';
      var args = [].slice.call(arguments);
      return fn.apply(this, args);
    };
  };

  var forms = [],
      inputs = {},
      uploading = false,
      onSubmit = function(ev) {
        if(uploading) {
          ev.preventDefault();
        }
      };

  var FileInput = function(id, hash) {
    var iframe = global.document.createElement('iframe'),
        input = global.document.getElementById(id);
    iframe.src = '/xdu/?file='+encodeURIComponent(input.value)+'#!/'+hash+'/'+id+'/';
    iframe.seamless = true;
    this.iframe = iframe;
    this.input = input;
    this.id = id;
    this.hash = hash;

    var el = input;
    while(el) {
      if(el.tagName == 'FORM') {
        for(var i = 0, len = forms.length; i < len; ++i) {
          if(forms[i] === el) break;
        }
        if(i === len) {
          forms.push(el);
          el.addEventListener('submit', onSubmit);
        }
        break;
      }
      el = el.parentElement;
    }

    inputs[id] = this;

    global.addEventListener('load', function() {
      input.parentElement.insertBefore(iframe, input);
    });
  };

  var startUpload = deleteHash(function(id) {
    uploading = true;
    var input = inputs[id];
    input &&
      (input.input.className += ' uploading');
  });

  var finishUpload = deleteHash(function(id, value) {
    uploading = false;
    var input = inputs[id];
    input &&
      (input.input.className = input.input.className.replace(/ uploading/g, ''),
       input.input.value = decodeURIComponent(value));
  });

  var removeItem = deleteHash(function(id) {
    var input = inputs[id];
    input &&
      (input.input.value = '');
  });

  var hashes = [
    [/^\/uploading\/([\w\d_-]+)\/$/, startUpload],
    [/^\/ready\/([\w\d_-]+)\/(.*)$/, finishUpload],
    [/^\/remove\/([\w\d_-]+)\/$/, removeItem]
  ];

  var interval = setInterval(function() {
    for(var i = 0, len = hashes.length; i < len; ++i) {
      var match = hashes[i][0](location.hash.slice(2));
      if(match) {
        hashes[i][1].apply({}, match.slice(1));
      }
    }
  }, 10);

  exports.input = function(id, hash) {
    return new FileInput(id, hash); 
  };
})(window.III = {}, window);
