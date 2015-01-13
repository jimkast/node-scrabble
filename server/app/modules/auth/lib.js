'use strict';

var jwt = require('jwt-simple'),
    moment = require('moment'),

    mongoose = require('mongoose'),
    User = mongoose.model('User');


function parseToken(token, secret, callback) {

    var decodedJwt;


    if (!token) {
        callback(true);
        return;
    }

    try {
        decodedJwt = jwt.decode(token, secret);
    } catch (e) {
        callback(true);
        return;
    }

    if (decodedJwt.expires <= Date.now()) {
        callback(true);
        return;
    }

    User.findOne({
        _id: decodedJwt.userId
    }, function(err, user) {
        if (err) {
            callback(true);
        } else {
            callback(null, user);
        }
    });

};


function generateToken(user, secret) {

    var token = jwt.encode({
        userId: user._id,
        expires: moment().add(7, 'days').valueOf()
    }, secret);

    return token;
};


function login(credentials, secret, callback) {

    User.findOne({
        username: credentials.username
    }, function(err, user) {

        if (err) {
            callback({
                error: 'NON_EXISTENT_USER'
            });
            return;
        }

        // test a matching password
        user.comparePassword(credentials.password, function(passwordError, isMatch) {

            if (passwordError) {
                callback({
                    error: 'ERROR_COMPARING_PASSWORDS'
                });
                return;
            }

            if (isMatch) {

                var token = generateToken(user, secret);
                callback(null, {
                    expiresAt: 'aaaa',
                    user: user.toJSON(),
                    token: token
                })

            } else {
                callback({
                    error: 'WRONG_PASSWORD'
                });
            }

        });

    });

};


module.exports = {
    login: login,
    parseToken: parseToken,
    generateToken: generateToken,
};
