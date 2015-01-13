'use strict';
/**
 * Module dependencies.
 */
var config = require('./config/config.json'),
    mongoose = require('mongoose');
    
    // cluster = require('cluster'),
    // domain = require('domain').create();




var db;
var maxWorkers = 4;



var workers = process.env.WORKERS || Math.min(maxWorkers, require('os').cpus().length);


/*if (cluster.isMaster) {

    console.log('Starting Cluster with %s workers...', workers);

    for (var i = 0; i < workers; ++i) {
        var worker = cluster.fork().process;
        console.log('Worker %s started.', worker.pid);
    }

    cluster.on('exit', function(worker) {
        console.log('---- Worker %s died. Restarting...', worker.process.pid);
        cluster.fork();
    });

} else {*/


    // // Bootstrap db connection
    // domain.on('error', function(er) {
    //     console.log('DB connect error...');
    // });

    db = mongoose.connect(config.db, function(err){
        if(err){
             console.error('Database connection error...')
        }
    });



    // Init the express application
    var app = require('./express')(db);

    app.set('jwtTokenSecret', 'YOUR_SECRET_STRING');
    

    // Bootstrap passport config
    //require('./config/passport')();

    // Start the app by listening on <port>
    app.listen(config.port);

    // Expose app
    exports = module.exports = app;

    // Logging initialization
    console.log('Cars FTI application started on port ' + config.port);

    /*
     require('./app/repository/outsource/rental-conditions')
     ;*/

//}






