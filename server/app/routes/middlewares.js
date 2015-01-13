'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');

var mongoose = require('mongoose'),
    User = mongoose.model('User');


module.exports = function(app) {


    function authenticate(req, res, next) {

        var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

        var decodedJwt;

        if (token) {
            try {
                decodedJwt = jwt.decode(token, app.get('jwtTokenSecret'));
            } catch (e) {

            }


            if (decodedJwt) {


                checkJwtValidity(decodedJwt, function(err, user) {
                    if (err) {
                        res.status(401);
                        res.json({
                            message: 'UNAUTHORIZED'
                        });
                    } else {
                        req.user = user;
                        return next();
                    }
                });

                return;

            }
        }

        res.status(401);
        res.json({
            message: 'UNAUTHORIZED'
        });

    };

    function generateToken(user) {

        var expires = moment().add(7, 'days').valueOf();

        var token = jwt.encode({
            userId: user._id,
            exp: expires
        }, app.get('jwtTokenSecret'));

        return token;
    };


    function refreshToken(req, res, next) {
        return generateToken()
    };


    return {
        authenticate: authenticate,
        generateToken: generateToken,
        refreshToken: refreshToken
    };


};


function checkJwtValidity(decodedJwt, callback) {
    if (decodedJwt.expires <= Date.now()) {
        return false;
    }


    User.findOne({
        _id: decodedJwt.userId
    }, function(err, user) {
        callback(err, user);
    });

};
