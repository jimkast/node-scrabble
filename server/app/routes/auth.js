'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash');



module.exports = function(app) {


var Auth = require('./middlewares')(app);


    app.route('/api/register').post(function(req, res) {

        var user = new User(req.body);

        user.save(function(err) {
            if (err) {
                return res.status(400).send(err);
            } else {
                res.json(user);
            }
        });
    });



    app.route('/api/login').post(function(req, res) {

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

                    var token = Auth.generateToken(user);

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

    });

	
	app.route('/api/auth/refresh-token').post(Auth.refreshToken, function(req, res) {
        res.json('refreshed!!!');
    });


    app.route('/api/protected').get(Auth.authenticate, function(req, res) {
        res.json({
        	message: 'passed!!!',
        	user: req.user
        });
    });


};


