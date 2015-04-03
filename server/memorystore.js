
var jwt = require('jsonwebtoken');


var model = module.exports;

var secret = 'My Super secret key';

// In-memory datastores:
var oauthAccessTokens = [],
  oauthRefreshTokens = [],
  oauthClients = [{
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    redirectUri: ''
  }],
  authorizedClientIds = {
    password: [
      'clientid'
    ],
    refresh_token: [
      'clientid'
    ]
  };

// Debug function to dump the state of the data stores
model.dump = function() {
  console.log('oauthAccessTokens', oauthAccessTokens);
  console.log('oauthClients', oauthClients);
  console.log('authorizedClientIds', authorizedClientIds);
  console.log('oauthRefreshTokens', oauthRefreshTokens);
};

/*
 * Required
 */

model.getAccessToken = function(bearerToken, callback) {
  for (var i = 0, len = oauthAccessTokens.length; i < len; i++) {
    var elem = oauthAccessTokens[i];
    if (elem.accessToken === bearerToken) {
      return callback(false, elem);
    }
  }
  callback(false, false);
};

model.getRefreshToken = function(bearerToken, callback) {
  for (var i = 0, len = oauthRefreshTokens.length; i < len; i++) {
    var elem = oauthRefreshTokens[i];
    if (elem.refreshToken === bearerToken) {
      return callback(false, elem);
    }
  }
  callback(false, false);
};

model.getClient = function(clientId, clientSecret, callback) {
  for (var i = 0, len = oauthClients.length; i < len; i++) {
    var elem = oauthClients[i];
    if (elem.clientId === clientId &&
      (clientSecret === null || elem.clientSecret === clientSecret)) {
      return callback(false, elem);
    }
  }
  callback(false, false);
};

model.grantTypeAllowed = function(clientId, grantType, callback) {
  callback(false, authorizedClientIds[grantType] &&
    authorizedClientIds[grantType].indexOf(clientId.toLowerCase()) >= 0);
};

model.saveAccessToken = function(accessToken, clientId, expires, userId, callback) {
  oauthAccessTokens.unshift({
    accessToken: accessToken,
    clientId: clientId,
    userId: userId,
    expires: expires
  });

  callback(false);
};

model.saveRefreshToken = function(refreshToken, clientId, expires, userId, callback) {
  oauthRefreshTokens.unshift({
    refreshToken: refreshToken,
    clientId: clientId,
    userId: userId,
    expires: expires
  });

  callback(false);
};

/*
 * Required to support password grant type
 */
model.getUser = function(username, password, callback) {
  if (username === password) {
    var elem = {
      id: username,
      username: username
    }
    return callback(false, elem);
  }
  callback(false, false);
};


model.generateToken = function(type, req, callback) {
  var username = req.body.username;
  var tokenData = {user: username, roles: ['user']};
  if(username.indexOf('admin') === 0) {
    tokenData.roles.push('admin');
  }
  var token = jwt.sign(tokenData, secret);
  callback(undefined, token);
};

model.verify = function(token, callback) {
  jwt.verify(token, secret, callback);
}
model.decode = function(token) {
  return jwt.verify(token, secret);
}
