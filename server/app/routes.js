'use strict';

var _ = require('lodash');
var Game = require('./classes/Game');
var Move = require('./classes/Move');
var utils = require('./common/utils');

var mongoose = require('mongoose'),
    GameModel = mongoose.model('Game'),
    PlayerModel = mongoose.model('Player');

var util = require('util');



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


var row = 20;


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



        var result = game.receiveMove({
            _id: playerId
        }, moveData);


        if(result){
        	row++;
        }

        res.json(game);


    });









    app.route('/api/players/create').get(function(req, res) {

        var obj = req.query;

        PlayerModel.create(obj, function(err, data) {
            res.json(data);
        });

    });

    app.route('/api/players').get(function(req, res) {

        PlayerModel.find(function(err, data) {
            res.json(data);
        });

    });

    app.route('/api/players/:id').get(function(req, res) {

        var id = req.params.id;

        PlayerModel.findOne({
            _id: id
        }, function(err, data) {
            res.json(data);
        });

    });






    app.route('/api/games/create').get(function(req, res) {

        var g = new Game();

        g.newGame(3, 'el');

        GameModel.create(g, function(err, data) {
            res.json(data);
        });

    });

    app.route('/api/games').get(function(req, res) {

        GameModel.find(function(err, data) {
            res.json(data);
        });

    });

    app.route('/api/games/:id').get(function(req, res) {

        var id = req.params.id;

        GameModel.findOne({
            _id: id
        }, function(err, data) {
            res.json(data);
        });

    });









    app.route('/api/games/:gameId/register/:playerId').get(function(req, res) {

        var gameId = req.params.gameId;
        var playerId = req.params.playerId;

        GameModel.findOne({
            _id: gameId
        }, function(err, game) {

            PlayerModel.findOne({
                _id: playerId
            }, function(err, player) {

                _.extend(game, Game.prototype)

                game.registerPlayerForGame(player);

                game.save(function(err) {
                    res.json({
                        error: err,
                        data: game
                    });
                });


            });

        });

    });


    app.route('/api/games/:gameId/unregister/:playerId').get(function(req, res) {

        var gameId = req.params.gameId;
        var playerId = req.params.playerId;

        GameModel.findOne({
            _id: gameId
        }, function(err, game) {

            PlayerModel.findOne({
                _id: playerId
            }, function(err, player) {

                _.extend(game, Game.prototype)

                game.unregisterPlayerFromGame(player);

                game.save(function(err) {
                    res.json({
                        error: err,
                        data: game
                    });
                });

            });

        });

    });




    app.route('/api/games/:gameId/submit/:playerId').post(function(req, res) {

        var gameId = req.params.gameId;
        var playerId = req.params.playerId;

        var moveData = req.body;

        var move = new Move(moveData);

        if (!move.isValid) {
            return false;
        }


        GameModel.findOne({
            _id: gameId
        }, function(err, game) {

            PlayerModel.findOne({
                _id: playerId
            }, function(err, player) {

                _.extend(game, Game.prototype);


                game.parseHistory();

                game.receiveMove(player, req.body);

                game.save(function(err) {
                    res.json({
                        error: err,
                        data: game
                    });
                });

            });

        });

    });








};

