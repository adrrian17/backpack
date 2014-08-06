default_url_options = {
  protocols: ["http", "https"],
  require_tld: true,
  require_protocol: false
};

merge = function(obj, defaults) {
  var key;
  obj = obj || {};
  for (key in defaults) {
    if (typeof obj[key] === "undefined") {
      obj[key] = defaults[key];
    }
  }
  return obj;
};

_isURL = function(str, options) {
  var match, port, url;
  if (!str || str.length >= 2083) {
    return false;
  }
  options = merge(options, default_url_options);
  url = new RegExp("^(?!mailto:)(?:(?:" + options.protocols.join("|") + ")://)" + (options.require_protocol ? "" : "?") + "(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:www.)?xn--)?(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" + (options.require_tld ? "" : "?") + ")|localhost)(?::(\\d{1,5}))?(?:(?:/|\\?|#)[^\\s]*)?$", "i");
  match = str.match(url);
  port = (match ? match[1] : 0);
  return !!(match && (!port || (port > 0 && port <= 65535)));
};

exports.isURL = _isURL;

exports.validate = function* (inputChan, downloadChan) {
  for(;;) {
    var userUrl = yield inputChan.take();
    console.log(userUrl)
    console.log(_isURL(userUrl))
    if (_isURL(userUrl)) {
      yield downloadChan.put(userUrl);
    }
  }
}
