'use strict';


var _ = require('lodash'),
    util = require('util'),
    utils = require('../common/utils'),

    Bucket = require('./Bucket'),
    Board = require('./Board'),
    Word = require('./Word'),
    Tile = require('./Tile'),
    Multipoint = require('./Multipoint'),
    Player = require('./Player'),

    enums = require('../data/enumerators'),
    gameStates = enums.gameStates;



function Game() {};


Game.prototype.newGame = function(size, langPack, boardType, rackSize) {

    if (typeof size === 'object') {
        size = size.size;
        langPack = size.langPack;
        boardType = size.boardType;
        rackSize = size.rackSize;
    }

    var game = this;

    var config = {
        createdAt: new Date(),
        size: size,
        langPack: langPack,
        boardType: boardType,
        rackSize: rackSize || 7,
        players: [],
        history: [],
        state: gameStates.GAME_WAITING_FOR_PLAYERS,
        playingState: {
            playUsers: [],
            playingUser: 0,
            bucket: {},
            timer: 0,
            foldCounter: 0
        }
    };


    _.extend(game, config);

    return game;
};



Game.prototype.parseHistory = function() {

    var game = this;
    game.board = new Board(game.boardType);
    game.bucket = new Bucket(game.langPack);

    game.board.build();

    game.history.forEach(function(historyObject) {
        game.executeAction(historyObject);
    });

    if (game.state === enums.gameStates.GAME_STARTED) {
        game.playingState.timer = game.remainingTime();
    };

    return game;
};




Game.prototype.registerPlayerForGame = function(player) {
    var game = this;

    if (game.players.length >= game.size) {
        return false;
    }

    player.registeredAt = new Date();
    player.points = 0;
    player.tiles = [];

    game.players.push(player);
    return game;
};


Game.prototype.unregisterPlayerFromGame = function(player) {

    var game = this;

    if (game.players.length <= 0) {
        return false;
    }

    Player.remove(game.players, player);

    return game;
};






Game.prototype.start = function() {
    var game = this;

    game.playingState.playUsers = [];

    game.playingState.playUsers = _.shuffle(game.players).map(function(player) {

        var playUser = {
            _id: player._id,
            tiles: [],
            points: 0,
            foldCounter: 0
        };
        game.givePlayerTiles(playUser, 7);
        return playUser;
    });

    game.state = enums.gameStates.GAME_STARTED;

    game.history.push({
        type: enums.moveTypes.GAME_STARTED,
        time: new Date()
    });

    return game;
};


Game.prototype.finish = function() {
    var game = this;

    game.winnerUser = Player.getWinner(game.playingState.playUsers);

    game.history.push({
        type: enums.moveTypes.GAME_FINISHED,
        time: new Date()
    });

    game.state = enums.gameStates.GAME_FINISHED;

    return game;
};





Game.prototype.giveTurn = function() {
    var game = this;

    var max = game.playingState.playUsers.length - 1;

    game.playingState.playingUser = game.playingState.playingUser >= max ? 0 : game.playingState.playingUser + 1;

    return game.playingState.playUsers[game.playingState.playingUser];
};





Game.prototype.stopPlayerFromGame = function(player) {
    Player.remove(this.playingState.playUsers, player);
    return this;
};


Game.prototype.quit = function(player) {
    var game = this;

    removePlayerTiles(player).forEach(function(tile) {
        game.bucket.push(tile);
    });

    stopPlayerFromGame(player);

    return game;
};


Game.prototype.playerTimeout = function(player) {
    this.fold(player);
    return this;
};

Game.prototype.remainingTime = function() {
    return new Date() - _.last(this.history).time;
};


Game.prototype.foldMove = function(player, tiles) {
    var game = this;

    if (!(tiles instanceof Array)) {
        tiles = [];
    }

    var historyObject = {
        type: enums.moveTypes.MOVE_FOLD,
        time: new Date(),
        data: tiles
    };

    game.executeAction(historyObject);
};

Game.prototype.givePlayerTiles = function(player, num) {
    var game = this;
    var newTiles = utils.removeRandom(game.bucket.tiles, num);

    newTiles.forEach(function(tile) {
        player.tiles.push(tile);
    });

    return newTiles;
};

Game.prototype.removePlayerTiles = function(player, tiles) {
    var game = this;
    // player.tiles = _.intersection(player.tiles, tiles);

    if (tiles) {
        return Tile.remove(player.tiles, tiles);
    }

    var oldTiles = player.tiles;
    player.tiles = [];
    return oldTiles;
};



Game.prototype.getWinner = function() {
    var game = this;
    return Player.sortByPoints(game.playingState.playUsers)[0];
};


Game.prototype.getPlayingUser = function() {
    return this.playingState.playUsers[this.playingState.playingUser];
};


Game.prototype.executeAction = function(actionData) {

    var game = this;
    var player = game.getPlayingUser();

    if (actionData.type === enums.moveTypes.MOVE_WORD) {

        player.points += actionData.result.points;
        game.removePlayerTiles(player, Tile.extract(actionData.data));


        if (actionData.newTiles) {
            game.board.placeMove(actionData.data);
            Tile.remove(game.bucket.tile, actionData.newTiles);
            player.push(actionData.newTiles);
        } else {
            actionData.newTiles = game.givePlayerTiles(player, actionData.data.length);
        }

        game.board.lockMove(actionData.data);

        if (game.board.isEmpty) {
            game.board.isEmpty = false;
        }

        game.giveTurn();

    } else if (actionData.type === enums.moveTypes.MOVE_FOLD) {

        player.foldCounter++;
        game.removePlayerTiles(player, actionData.data).forEach(function(tile) {
            game.bucket.push(tile);
        });

        if (actionData.newTiles) {
            Tile.remove(game.bucket.tile, actionData.newTiles);
            player.push(actionData.newTiles);
        } else {
            actionData.newTiles = game.givePlayerTiles(player, actionData.data.length);
        }
    }
};


Game.prototype.checkMoveValidity = function(move, callback) {

    var game = this;

    // callback = typeof callback == 'function' ? callback : emptyFunction;

    var segment = game.board.lineTraverseFilled(_.first(move), _.last(move));

    // console.log(segment, move, 'segment')

    if (segment.length < move.length) {
        callback({
            message: 'hasGaps!!!'
        });
        return false;
    }

    if (!game.board.isEmpty) {
        if (!game.board.hasFilledNeighbours(move)) {
            callback({
                message: 'does not hasFilledNeighbours'
            });
            return false;
        }
    } else {
        if (!game.board.passesFromCenter(move)) {
            callback({
                message: 'error: passesFromCenter'
            });
            return false;
        }
    }

    callback();

};


Game.prototype.calculateMovePoints = function(move) {
    var game = this;
    var sum = 0;
    var words = game.board.getWords(move);

    console.log('');
    console.log('======= MOVE CALCULATION =========');
    console.log('calculating words, total: ', words.length, words)

    words.forEach(function(word, index) {
        var result = Word.calculatePoints(word);
        sum += result;
        console.log((index + 1) + ' : ' + Word.log(word) + ', points: ' + result);
    });

    if (move.length >= game.rackSize) {
        sum += 50;
    }

    console.log('');
    console.log('______');
    console.log('TOTAL: ' + sum)
    console.log('======= MOVE CALCULATION END =========');
    console.log('');

    return {
        points: sum
    };
};



Game.prototype.receiveMove = function(playerData, moveData, callback) {
    var game = this;

    // callback = typeof callback == 'function' ? callback : emptyFunction;

    var moveTiles = Tile.extract(moveData);

    var player = game.getPlayingUser();



    // VALIDATION 
    if (!Player.compare(player, playerData)) {
        callback({
            message: playerData._id + 'wrong player... now playing: ' + player._id
        });
        return false;
    }

    if (!Player.playerHasValidTiles(player, moveTiles)) {

        callback({
            message: moveTiles + player.tiles + 'tiles do not belong to player'
        });
        return false;
    }

    Multipoint.sort(moveData);

    if (!game.board.validCoords(moveData)) {
        callback({
            message: 'error: invalidCoords (outside board)'
        });
        return false;
    }

    if (!Multipoint.isAligned(moveData)) {
        callback({
            message: 'move is not aligned'
        });
        return false;
    }


    game.board.placeMove(moveData);

    game.checkMoveValidity(moveData, function(moveErr, moveValidationResult) {

        if (moveErr) {
            game.board.unplaceMove(moveData);
            callback(moveErr, moveValidationResult);
            return false;
        }


        var words = game.board.getWords(moveData);

        Word.wordsExist(words, function(wordsErr, wordsResult) {

            if (wordsErr) {
                callback(wordsErr);
            }

            var historyObject = {
                time: new Date(),
                type: enums.moveTypes.MOVE_WORD,
                data: moveData,
                // newTiles: newTiles,
                player: playerData,
                result: game.calculateMovePoints(moveData)
            };

            game.history.push(historyObject);

            game.executeAction(historyObject);

            callback(null, historyObject);

            return historyObject;
        });


    });

};


function emptyFunction() {};


module.exports = Game;
