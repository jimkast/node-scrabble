'use strict';

module.exports = function(app) {

    var endpoint = 'users';

    var controllers = require('../controllers/' + endpoint);

    app.route('/api/' + endpoint)
        .post(controllers.create)
        .get(controllers.list)
        .put(controllers.update);

    app.route('/api' + endpoint + '/:id')
        .get(controllers.getById)
        .put(controllers.update)
        .delete(controllers.remove);

};

