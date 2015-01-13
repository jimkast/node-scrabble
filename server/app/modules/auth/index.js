'use strict';

module.exports = function(app) {

    run: function(app) {
        return require('lib/routes')(app);
    },

    controllers: require('./lib/controllers'),
    lib: require('./lib/lib')

};
