'use strict';

var mongoose = require('mongoose'),
    Auth = require('../modules/auth');


module.exports = {

    refreshToken: function(req, res) {

        res.json({
            token: Auth.generateToken(req.user, req.app.get('jwtTokenSecret'))
        });
    },

    login: function(req, res) {

        var credentials = req.body;

        Auth.login(credentials, req.app.get('jwtTokenSecret'), function(err, result) {

            if (err) {
                res.status(400).json(err);
            } else {
                res.json(result);
            }
        });

    },

    authenticate: function(req, res, next) {

        var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

        Auth.parseToken(token, req.app.get('jwtTokenSecret'), function(err, user) {
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

    }

};
