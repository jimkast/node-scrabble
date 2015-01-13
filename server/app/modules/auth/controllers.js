'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Auth = require('../modules/auth');



module.exports = {

    register: function(req, res) {

        var user = new User(req.body);

        user.save(function(err) {
            if (err) {
                return res.status(400).json(err);
            } else {
                res.json(user);
            }
        });
    },

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

    }


};
