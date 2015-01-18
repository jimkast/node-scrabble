'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    GameModel = mongoose.model('Game'),
    scrabble = require('../modules/scrabble');
// gameMapper = require('../mappers/game'),
// playerMapper = require('../mappers/player');



module.exports = {


    list: function(req, res, next) {

        var query = req.query;

        GameModel.find(query, function(err, data) {
            res.json(err || data);
        });

    },


    getById: function(req, res, next) {

        var id = req.param('id');

        GameModel.findById(id, function(err, data) {
            res.json(err || data);
        });

    },



    remove: function(req, res, next) {

        var id = req.param('id');

        GameModel.findById(id, function(findErr, game) {
            game.enabled = false;

            if (findErr) {
                res.json(findErr);
                return;
            }

            game.save(function(saveErr, savedGame) {
                res.json(saveErr || savedGame);
            });
        });

    },

    update: function(req, res, next) {



    },


    create: function(req, res, next) {

        var gameData = req.body;

        // var player = playerMapper.toPlayer(req.user);
        var player = req.user;

        // var dbGame = new GameModel(gameData);

        var game = new scrabble.Game();
        game.create(gameData.size, gameData.langPack, gameData.boardType, gameData.rackSize);
        game.registerCreator(player);
        game.registerPlayerForGame(player);


        var dbGame = new GameModel(game);

        dbGame.save(function(err) {
            if (err) {
                return res.status(400).json(err);
            } else {
                res.json(dbGame);
            }
        });

    },




    register: function(req, res, next) {

        var id = req.param('id');
        var player = req.user;

        GameModel.findById(id, function(err, dbGame) {

            var game = new scrabble.Game();
            _.extend(game, dbGame.toJSON());

            var registrationResult = game.registerPlayerForGame(player);

            if (!registrationResult) {

                res.status(400).json({
                    error: 'REGISTRATION_ERROR'
                });
                return;
            }


            if (game.players.length === game.size) {
                game.parseHistory();
                game.start();
            }

            GameModel.update({
                    _id: dbGame._id
                }, {
                    players: game.players,
                    history: game.history,
                    state: game.state,
                    playingState: game.playingState
                },
                function(err) {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.json(game)
                    }
                });
        });


    },


    unregister: function(req, res, next) {

        var id = req.param('id');
        var player = req.user;

        GameModel.findById(id, function(err, dbGame) {

            if (err) {
                res.json(err)
                return;
            }

            var game = new scrabble.Game();
            _.extend(game, dbGame.toJSON());


            if (game.isActive()) {
                res.json({
                    message: 'YOU_CAN_NOT_UNREGISTER_GAME: ALREADY STARTED'
                });
            }

            var unregistrationResult = game.unregisterPlayerFromGame(player);

            if (!unregistrationResult) {

                res.status(400).json({
                    error: 'ALREADY_NOT_REGISTERED'
                });
                return;
            }

            GameModel.update({
                    _id: dbGame._id
                }, {
                    players: game.players,
                    history: game.history,
                    state: game.state
                },
                function(err) {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.json(game)
                    }
                });
        });


    },


    submitMove: function(req, res, next) {

        var id = req.param('id');
        var player = req.user;
        var moveData = req.body;

        GameModel.findById(id, function(err, dbGame) {


            if (err) {
                res.status(400).json(err)
                return;
            }

            var game = new scrabble.Game();
            // game.create(dbGame.size, dbGame.langPack, dbGame.boardType, dbGame.rackSize);
            _.extend(game, dbGame.toJSON());


            if (!game.isActive()) {
                res.status(400).json({
                    message: 'GAME_IS_NOT_ACTIVE'
                });
                return;
            }

            game.parseHistory();


            game.receiveMove(player, moveData, function(err, result) {

                if (err) {
                    res.status(400).json({
                        error: err,
                        game: game
                    });
                    return;
                }

                GameModel.update({
                        _id: dbGame._id
                    }, {
                        history: game.history,
                        playingState: game.playingState
                    },
                    function(err) {
                        if (err) {
                            res.status(400).json(err);
                        } else {
                            res.json(result)
                        }
                    });

            });

        });

    },


    foldMove: function(req, res, next) {



    },



};
