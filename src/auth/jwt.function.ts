exports.cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['accessToken'];
  }
  return token;
};