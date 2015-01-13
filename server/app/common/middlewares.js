'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');

function authenticate(req, res, next) {

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    var decodedJwt;

    if (token) {

        try {
            decodedJwt = jwt.decode(token, app.get('jwtTokenSecret'));
            
            if (isValidJwt(decodedJwt)) {
                return next();
            }
        } catch (e) {

        }
    }

    res.status(401);
    res.json({
        message: 'UNAUTHORIZED'
    });

};

function generateToken(user, secret) {

    var expires = moment().add(7, 'days').valueOf();

    var token = jwt.encode({
        userId: user._id,
        exp: expires
    }, secret);

    return token;
};

module.exports = {
    authenticate: authenticate,
    generateToken: generateToken
};
