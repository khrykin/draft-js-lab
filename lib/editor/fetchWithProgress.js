'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchWithProgress;
function fetchWithProgress(url) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var onProgress = arguments[2];

  return new Promise(function (res, rej) {
    var xhr = new XMLHttpRequest();
    xhr.open(opts.method || 'get', url);
    for (var k in opts.headers || {}) {
      xhr.setRequestHeader(k, opts.headers[k]);
    }xhr.onload = function (e) {
      return res(JSON.parse(e.target.responseText));
    };
    xhr.onerror = rej;
    if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
    xhr.send(opts.body);
  });
}