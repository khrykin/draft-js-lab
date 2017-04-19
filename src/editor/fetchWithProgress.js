export default function fetchWithProgress(url, opts={}, onProgress) {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open(opts.method || 'get', url);
    for (var k in opts.headers || {})
      xhr.setRequestHeader(k, opts.headers[k]);
    xhr.onload = e => res(JSON.parse(e.target.responseText));
    xhr.onerror = rej;
    if (xhr.upload && onProgress)
        xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
    xhr.send(opts.body);
  });
}
