var urlLib = require('url');
var Url    = urlLib.Url;

var originalUrlParse = Url.prototype.parse;

Url.prototype.parsePatched = function patchedParse(urlStr, parseQueryString, slashesDenoteHost)
{
  if (typeof urlStr !== 'string') {
    throw new TypeError('Parameter "url" must be a string, not ' + typeof urlStr);
  }

  var urlParts = urlStr !== null
    ? urlStr.match(/^([a-z]+:\/\/)(?:(\S*)?@)(.+)/i)
    : void 0;

  if (urlParts === null) {
    return originalUrlParse.apply(this, arguments);
  }

  var protocol    = urlParts[1],
      auth        = urlParts[2],
      hostAndPath = urlParts[3];

  var result = originalUrlParse.call(
    this,
    "" + protocol + hostAndPath,
    parseQueryString,
    slashesDenoteHost);

  result.auth = auth;
  result.href = urlLib.format(result);
  return result;
};

function urlParsePatched(urlStr, parseQueryString, slashesDenoteHost)
{
  if (urlStr instanceof Url) return urlStr;

  var u = new Url();
  u.parsePatched(urlStr, parseQueryString, slashesDenoteHost);
  return u;
}

function installPatchGlobally()
{
  Url.prototype.parse = Url.prototype.parsePatched;
}

module.exports             = urlParsePatched;
module.exports.parse       = urlParsePatched;
module.exports.installPatch= installPatchGlobally;