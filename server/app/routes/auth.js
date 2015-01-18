'use strict';

module.exports = function(app) {

    var authControllers = require('../controllers/auth');

    app.route('/api/auth/login').post(authControllers.login);
    app.route('/api/auth/refresh-token').post(authControllers.authenticate, authControllers.refreshToken);

};
