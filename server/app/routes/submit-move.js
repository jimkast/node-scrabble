'use strict';

var _ = require('lodash');
var Game = require('../classes/Game');
var Player = require('../classes/Player');
var utils = require('../common/utils');

var mongoose = require('mongoose'),
    GameModel = mongoose.model('Game'),
    PlayerModel = mongoose.model('Player');

var util = require('util');





function authenticate(req, res, next) {
    return next();
};



var game = new Game();
game.newGame(3, 'el');

game.registerPlayerForGame({
    _id: '111',
    name: 'jimmy',
    surname: 'kastanis'
});

game.registerPlayerForGame({
    _id: '222',
    name: 'john',
    surname: 'kikidis'
});

game.registerPlayerForGame({
    _id: '333',
    name: 'takis',
    surname: 'papadopoulos'
});

game.parseHistory();

game.start();


var row = 8;


module.exports = function(app) {


    app.route('/aaa/:playerId').get(function(req, res) {

        var playerId = req.params.playerId;

        var start = 7;
        var moveData = [];
        var placeholders = game.playingState.playUsers.filter(function(player) {
            return player._id == playerId;
        })[0].tiles.slice(2, 5).forEach(function(tile, index) {
            moveData.push({
                tile: tile,
                x: index + start,
                y: row
            });
        });


        game.receiveMove({
            _id: playerId
        }, moveData, function(err, result) {
            // save history (result variable) to database first...

            if (result) {
                row++;
            }
            res.json({
                aaa: 'sdfsdf',
                error: err,
                result: result
            });
        });


    });






    app.route('/api/:gameId/:playerId').post(authenticate, function(req, res) {


        // CONTROLLER
        // 1) player = req.user;

        // 2) validate 'req.body' from schema (lx-valid) -- middleware after authenticate???

        // 3) data = req.body;

        // 4) fetch game data from database

        // 5) check if game exists

        // 6) construct game object from database game data



        // ***** SCRABBLE CORE (BUSINESS LOGIC)

        // 7) check move validity
        //      a) is player current player playing ? 
        //      b) do tiles belong to user?
        //      c) is move valid?
        //      d) words exist?

        // step 7 return Move Result or Error Callback describing the error

        // 8) construct history item from move result

        // 9) update game history array

        // 10) update game data to database

        // 11) respond to player with new tiles

        // 12) ::WEBSOCKETS:: send the valid move to other players 

        // *******


        var validation,
            words,
            player = {
                _id: req.params.playerId
            },
            moveData = req.body,
            gameData;


        // = get from Db , game = new Game();
        game.newGame(gameData);


        // var game = Game.toGameObject();



        game.receiveMove(player, moveData, function(err, result) {
            // save history (result variable) to database first...

            res.json({
                error: result,
                result: result
            });
        });



    });



};
