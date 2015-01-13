'use strict';

module.exports = function(app) {

    var authControllers = require('./controllers');
    var middlewares = require('./middlewares')(app);

    app.route('/api/auth/register').post(authControllers.register);
    app.route('/api/auth/login').post(authControllers.login);
    app.route('/api/auth/refresh-token').post(middlewares.authenticate, authControllers.refreshToken);

};
