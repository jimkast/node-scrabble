'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Auth = require('../modules/auth');



module.exports = {

    register: function(req, res) {

        var user = new User(req.body);

        user.save(function(err) {
            if (err) {
                return res.status(400).send(err);
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

        User.findOne({
            username: credentials.username
        }, function(err, user) {

            if (err) {
                res.status(401);
                res.json('user does not exist!!!');
                return;
            }

            // test a matching password
            user.comparePassword(credentials.password, function(passwordError, isMatch) {

                if (passwordError) {
                    res.status(401);
                    res.json({
                        error: 'an error occured comparing passwords'
                    });
                    return;
                }

                if (isMatch) {

                    var token = Auth.generateToken(user, req.app.get('jwtTokenSecret'));

                    res.json({
                        expiresAt: 'aaaa',
                        user: user.toJSON(),
                        token: token
                    });

                } else {
                    res.json({
                        error: 'wrong password'
                    });
                }

            });

        });

    }


};
