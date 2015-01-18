'use strict';

var _ = require('lodash'),
    Game = require('./Game');


// function GameBO(game) {
//     this.game = game;
// };


function GameBO() {};

GameBO.create = function(player, gameData) {

    var game = new Game();
    game.setup(gameData.size, gameData.langPack, gameData.rackSize, gameData.boardType);
    game.registerCreator(player);
    game.registerPlayerForGame(player);
    return game;

};


GameBO.register = function(player, gameDTO, callback) {

    var game = new Game();
    _.extend(game, gameDTO);

    var registrationResult = game.registerPlayerForGame(player);

    if (!registrationResult) {
        callback({
            message: 'REGISTRATION_ERROR'
        });
        return;
    }

    if (game.players.length === game.size) {
        game.buildBoardAndBucket();
        game.start();
    }

    callback(null, game);
};


GameBO.unregister = function(player, gameDTO, callback) {

    var game = new Game();
    _.extend(game, gameDTO);


    if (game.hasStarted()) {
        callback({
            message: 'YOU_CAN_NOT_UNREGISTER_GAME: ALREADY STARTED'
        });
    }

    var unregistrationResult = game.unregisterPlayerFromGame(player);

    if (!unregistrationResult) {

        callback({
            error: 'ALREADY_NOT_REGISTERED'
        });
        return;
    }

    callback(null, game);
};



GameBO.submitMove = function(player, gameDTO, moveData, callback) {

    var game = new Game();
    // game.create(dbGame.size, dbGame.langPack, dbGame.boardType, dbGame.rackSize);
    _.extend(game, gameDTO);

    if (!game.hasStarted()) {
        callback({
            message: 'GAME_IS_NOT_ACTIVE'
        });
        return;
    }

    game.buildBoardAndBucket();

    game.receiveMove(player, moveData, function(err, result) {

        if (err) {
            callback({
                error: err
            });
            return;
        }

        callback(null, game);

    });
};


GameBO.foldMove = function(player, gameDTO, foldData, callback) {


    var game = new Game();
    // game.create(dbGame.size, dbGame.langPack, dbGame.boardType, dbGame.rackSize);
    _.extend(game, gameDTO);

    if (!game.hasStarted()) {
        callback({
            message: 'GAME_IS_NOT_ACTIVE'
        });
        return;
    }

    game.buildBoardAndBucket();

    game.foldMove(player, foldData, function(err, result) {

        if (err) {
            callback(err);
            return;
        }

        callback(result);

    });
};




module.exports = GameBO;
