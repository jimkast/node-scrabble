'use strict';

var jwt = require('jwt-simple');
var moment = require('moment'),

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


module.exports = {
    parseToken: parseToken,
    generateToken: generateToken
};
