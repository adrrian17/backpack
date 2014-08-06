var csp          = require("js-csp")
var extractor    = require("unfluff")

exports.parse = function* (ch) {
  for(;;) {
    var item = yield csp.take(ch)
    data = extractor(item.data);
    console.log(data);
  }
}
