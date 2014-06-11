/* Modules */
var csp              = require("csp");
var urlValidator     = require("./lib/url_validator.js");
var httpFetcher      = require("./lib/http_fetcher.js");

/* Channels */
var inputChan        = new csp.Chan();
var downloadChan     = new csp.Chan();
var scrapChan        = new csp.Chan();

gen = function* (inputChan) {
  yield inputChan.put("http://ssodelta.wordpress.com/?p=599&preview=true");
  yield inputChan.put("http://blog.ezyang.com/2011/11/how-to-read-haskell/");
  yield inputChan.put("http://www.strikingly.com/how-to-design");
  yield inputChan.put("http://www.evanmiller.org/how-not-to-sort-by-average-rating.html");
  yield inputChan.put("https://developer.apple.com/library/prerelease/ios/referencelibrary/GettingStarted/LandingPage/index.html")
  yield inputChan.put("https://github.com/cheeriojs/cheerio")
  yield inputChan.put("https://d13yacurqjgara.cloudfront.net/users/21909/screenshots/129608/shot_1299963399.jpg");
}

csp.spawn(gen, inputChan);
csp.spawn(urlValidator.validate, inputChan, downloadChan);
csp.spawn(httpFetcher.fetch, downloadChan, scrapChan);

partition = function* (channel) {
  for(;;) {
    // PSEUDO CODE ALERT!
    // var message = yield channel.take()
    // if isArticleView(message) then do ArticleViewThingInOtherFile(message)
    // if isWebView(message) then do WebViewThingInOtherFile(message)
  }
}

csp.spawn(partition, scrapChan)
