var csp              = require("csp");

exports.fetch = function* (downloadChan, scrapChan) {
  http  = require("http")
  https = require("https")
  for(;;) {
    var url = yield downloadChan.take();
    var module = /^https:/.test(url) ? https : http;
    _requestContent(module, url, scrapChan);
  }
}

_requestContent = function (module, url, channel) {
  return module.get(url, function(response) {
    var data = "";

    response.on("data", function(chunk) {
      return data += chunk;
    });

    return response.on("end", function () {
      message = {
        content_type: response.headers["content-type"]
        , data: "data"
        , url: url
      }
      csp.spawn(function* () {
        yield channel.put(message);
        csp.quit();
      });
    });
  }).on("error", function* () {
    return console.warn("TODO");
  });
};
