'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    GameModel = mongoose.model('Game'),
    // scrabble = require('../modules/scrabble');
    gameBO = require('../modules/scrabble/core/gameBO');
// gameMapper = require('../mappers/game'),
// playerMapper = require('../mappers/player');



module.exports = {


    list: function(req, res, next) {

        var query = req.query || {};

        query.enabled = true;

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

        gameBO.create(player, gameData, function(err, game) {

            var dbGame = new GameModel(game);

            dbGame.save(function(err) {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.json(dbGame);
                }
            });

        });

    },



    register: function(req, res, next) {

        var id = req.param('id');
        var player = req.user;

        GameModel.findById(id, function(err, dbGame) {

            if (err || !dbGame) {
                res.status(400).json(err)
                return;
            }

            gameBO.register(player, dbGame.toJSON(), function(error, game) {

                if (error) {
                    res.status(400).json(error);
                    return;
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
                            res.json()
                        }
                    });
            });

        });

    },


    unregister: function(req, res, next) {

        var id = req.param('id');
        var player = req.user;

        GameModel.findById(id, function(err, dbGame) {

            if (err || !dbGame) {
                res.status(400).json(err)
                return;
            }

            gameBO.unregister(player, dbGame.toJSON(), function(error, game) {

                if (error) {
                    res.status(400).json(error);
                    return;
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
        });


    },


    submitMove: function(req, res, next) {

        var id = req.param('id');
        var player = req.user;
        var moveData = req.body;

        GameModel.findById(id, function(err, dbGame) {


            if (err || !dbGame) {
                res.status(400).json(err)
                return;
            }


            gameBO.submitMove(player, dbGame.toJSON(), moveData, function(error, game) {

                if (error) {
                    res.status(400).json(error);
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
                            res.json(game)
                        }
                    });

            });

        });

    },


    foldMove: function(req, res, next) {

        var id = req.param('id');
        var player = req.user;
        var foldData = req.body;

        GameModel.findById(id, function(err, dbGame) {

            if (err || !dbGame) {
                res.status(400).json(err)
                return;
            }

            gameBO.foldMove(player, dbGame.toJSON(), foldData, function(error, game) {

                if (error) {
                    res.status(400).json(error);
                    return;
                }

                GameModel.update({
                        _id: dbGame._id
                    }, {
                        history: game.history,
                        playingState: game.playingState
                    },
                    function(updateError) {
                        if (updateError) {
                            res.status(400).json(updateError);
                        } else {
                            res.json(result)
                        }
                    });

            });



        });


    }

};
