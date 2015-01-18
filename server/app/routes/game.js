'use strict';


var authControllers = require('../controllers/auth');
var gameControllers = require('../controllers/game');


module.exports = function(app) {

    app.route('/api/game')
        .get(authControllers.authenticate, gameControllers.list)
        .post(authControllers.authenticate, gameControllers.create)

   app.route('/api/game/:id')
        .get(authControllers.authenticate, gameControllers.getById)
        .delete(authControllers.authenticate, gameControllers.remove);

    app.route('/api/game/:id/register')
    	.post(authControllers.authenticate, gameControllers.register);
    
    app.route('/api/game/:id/unregister')
    	.post(authControllers.authenticate, gameControllers.unregister);


    app.route('/api/game/:id/play')
        .post(authControllers.authenticate, gameControllers.submitMove);

    app.route('/api/game/:id/fold')
        .post(authControllers.authenticate, gameControllers.foldMove);

};
