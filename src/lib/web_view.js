stylesScrap = function* () {
  var cheerio = require("cheerio");
  for(;;) {
    var html = yield scrapChan.take();
    var $    = cheerio.load(html);

    $("head link").map(function(i, el) {
      if ($(this)[0].attribs.rel === "stylesheet") {
        var stylesUrl = $(this)[0].attribs.href

        if(urlValidator.isURL(stylesUrl)) {
          // TODO: pass the URL to download the stylesheet(s)
          console.log(stylesUrl);
        } else {
          // TODO: make the full URL for the stylesheet(s)
        }
      }
    })
  }
}
