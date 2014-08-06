 var csp          = require("js-csp");

exports.fetch = function* (downloadChan, scrapChan) {
  http  = require("http")
  https = require("https")
  for(;;) {
    var url = yield csp.take(downloadChan);
    var module = /^https:/.test(url) ? https : http;
    _requestContent(module, url, scrapChan);
  }
}

_requestContent = function (module, url, channel) {
  return module.get(url, function(response) {
    var inputBuffer = ""

    response.setEncoding('utf8')

    response.on("data", function(chunk) {
      return inputBuffer += chunk;
    });

    return response.on("end", function () {
      message = {
        content_type: response.headers["content-type"]
        , data: inputBuffer
        , url: url
      }
      csp.go(function* () {
        yield csp.put(channel, message)
      });
    });
  }).on("error", function* () {
    return console.warn("TODO");
  });
};
