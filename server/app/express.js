'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    mongoStore = require('connect-mongo')({
        session: session
    }),
    flash = require('connect-flash'),
    config = require('./config/config.json'),
    consolidate = require('consolidate'),
    path = require('path'),
    fs = require('fs');

//i18n = require('i18n-2');

module.exports = function(db) {

    // Initialize express app
    var app = express();

    // app.set('jwtTokenSecret', Math.random().toString(36).substring(15));
    app.set('jwtTokenSecret', 'test');

    // Passing the request url to environment locals
    app.use(function(req, res, next) {
        var url = req.protocol + '://' + req.headers.host +
            req.url;
        res.locals.url = url;
        // console.log(url)
        next();
    });

    // Should be placed before express.static
    app.use(compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader(
                'Content-Type'));
        },
        level: 9
    }));


    // Showing stack errors
    app.set('showStackError', true);


    // Set swig as the template engine
    app.engine('html', consolidate[config.templateEngine]);

    //  app.engine('html', swig.render);

    // set .html as the default extension
    app.set('view engine', 'html');
    app.set('views', config.viewsDirectory);




    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());

    app.use(function(error, req, res, next) {
        //Catch json error
        res.status(400).json({
            message: 'INVALID_JSON'
        });
    });


    app.use(methodOverride());

    // Enable jsonp
    app.enable('jsonp callback');

    // CookieParser should be above session
    app.use(cookieParser());

    // Express MongoDB session storage
    app.use(session({
        secret: config.sessionSecret
    }));

    /*
    i18n.expressBind(app, {
        locales: config.localization.locales,
        defaultLocale: config.localization.defaultLocale,
        cookieName: config.localization.cookieName,
        directory: config.localization.directory,
        extension: config.localization.extension
    });
*/

    // connect flash for flash messages
    app.use(flash());

    // Use helmet to secure Express headers
    app.use(helmet.xframe());
    app.use(helmet.iexss());
    app.use(helmet.contentTypeOptions());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');

    // Setting the app router and static folder
    app.use(express.static(path.resolve(config.publicDirectory)));



    fs.readdirSync(path.join(__dirname, 'models')).forEach(function(file) {
        require('./models/' + file);
    });


    fs.readdirSync(path.join(__dirname, 'routes')).forEach(function(file) {
        require('./routes/' + file)(app);
    });



    // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function(err, req, res, next) {
        // If the error object doesn't exists
        if (!err) return next();

        // Log it
        console.error(err.stack);

        // Error page
        res.status(500).render('500', {
            error: err.stack
        });
    });

    // Assume 404 since no middleware responded
    app.use(function(req, res) {
        res.status(404).json({
            url: req.originalUrl,
            error: 'Not Found'
        });
    });
    return app;
};
