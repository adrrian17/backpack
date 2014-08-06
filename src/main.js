/* Modules */
var csp          = require("js-csp")
var http         = require("http")
var urlValidator = require("./lib/url_validator.js")
var httpFetcher  = require("./lib/http_fetcher.js")
var articleView  = require("./lib/article_view.js")

/* Shared channels */
var genCh         = csp.chan()
var articleViewCh = csp.chan()

/* It reads from genCh channel and puts raw html into articleViewCh channel */
csp.go(httpFetcher.fetch, [genCh, articleViewCh])

/* It reads from articleViewCh channel, then parses html and prints to standard output */
csp.go(articleView.parse, [articleViewCh])


function defaultServer(req, res) {
  var inputBuffer = ""
  req
    .setEncoding('utf8')
    .on('data', function(chunk) { inputBuffer += chunk })
    .on('end', function() {
      csp.go(function*() {
        if (urlValidator.isURL(inputBuffer)) {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('Added ' + inputBuffer + ' to processing queue\n');
          yield csp.put(genCh, inputBuffer)
        }
      })
    });
}
http.createServer(defaultServer).listen(1337, '0.0.0.0');
console.log('Server running at http://127.0.0.1:1337/');
