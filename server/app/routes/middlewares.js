'use strict';

module.exports = function(app) {

    var Auth = require('../modules/auth');

    function authenticate(req, res, next) {

        var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

        Auth.parseToken(token, app.get('jwtTokenSecret'), function(err, user) {
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

    };

    return {
        authenticate: authenticate
    };
};
