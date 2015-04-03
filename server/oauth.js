var bodyParser = require('body-parser'),
    oauthserver = require('node-oauth2-server');

var memorystore = require('./memorystore');

module.exports = function(app) {

  app.use(bodyParser());
  app.oauth = oauthserver({
    model: memorystore,
    grants: ['password','refresh_token'],
    debug: true
  });

  app.all('/api/oauth/token', app.oauth.grant());

  app.get('/api/checkToken', app.oauth.authorise(), function(req, res) {
    //no check is necesary heare because the call was already authorized
    var headerToken = req.get('Authorization');
    var matches = headerToken.match(/Bearer\s(\S+)/);
    headerToken = matches[1];
    res.send(memorystore.decode(headerToken));
  });

  app.use(app.oauth.errorHandler());

  var model = memorystore;

}
