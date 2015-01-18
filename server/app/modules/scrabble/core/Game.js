'use strict';


var _ = require('lodash'),
    util = require('util'),
    // utils = require('../common/utils'),

    Bucket = require('./Bucket'),
    Board = require('./Board'),
    Word = require('./Word'),
    Tile = require('./Tile'),
    Multipoint = require('./Multipoint'),
    Player = require('./Player'),

    enums = require('./enumerators'),
    gameStates = enums.gameStates;



function Game() {};


Game.prototype.setup = function(size, langPack, rackSize, boardType) {

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
        state: gameStates.GAME_WAITING_FOR_PLAYERS
    };


    _.extend(game, config);

    return game;
};



Game.prototype.buildBoardAndBucket = function() {

    var game = this;
    game.board = new Board(game.boardType);
    game.bucket = new Bucket(game.langPack);
    game.board.build();

    game.history.forEach(function(historyObject) {
        processHistoryObject.call(game, historyObject);
    });

    return game;
};



Game.prototype.registerCreator = function(player) {
    this.createdBy = player;
    return this;
};


Game.prototype.registerPlayerForGame = function(player) {
    var game = this;

    if (game.players.length >= game.size) {
        return false;
    }

    if (Player.find(game.players, player)) {
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

    return Player.remove(game.players, player);

};






Game.prototype.start = function() {
    var game = this;

    game.state = enums.gameStates.GAME_STARTED;


    var playUsers = _.shuffle(game.players).map(function(player) {

        var playUser = {
            id: player.id,
            tiles: [],
            points: 0,
            foldCounter: 0
        };
        return playUser;
    });

    game.playingState = {
        playUsers: playUsers,
        playingUser: 0,
        timer: 0,
        foldCounter: 0
    };

    var totalTiles = [];

    playUsers.forEach(function(player) {
        var newTiles = game.givePlayerTiles(player, game.rackSize);
        totalTiles = tiles.concat(newTiles);
    });


    var historyObject = {
        type: enums.moveTypes.GAME_STARTED,
        time: new Date(),
        fromBucket: totalTiles
    };

    game.history.push(historyObject);

    return game;
};


Game.prototype.isOpen = function() {
    return this.state === enums.gameStates.GAME_WAITING_FOR_PLAYERS;
};

Game.prototype.hasStarted = function() {
    return this.state === enums.gameStates.GAME_STARTED;
};

Game.prototype.hasFinished = function() {
    return this.state === enums.gameStates.GAME_FINISHED;
};




Game.prototype.finish = function() {
    var game = this;

    game.state = enums.gameStates.GAME_FINISHED;

    game.winnerUser = Player.getWinner(game.playingState.playUsers);

    game.history.push({
        type: enums.moveTypes.GAME_FINISHED,
        time: new Date()
    });

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


Game.prototype.foldMove = function(playerData, tiles, callback) {

    var game = this;

    if (!(tiles instanceof Array)) {
        tiles = [];
    }


    var validation = game.validatePlayer(playerData, tiles);

    if (validation !== true) {
        callback(validation);
        return false;
    }


    var player = game.getPlayingUser();

    player.foldCounter++;
    game.removePlayerTiles(player, tiles).forEach(function(tile) {
        game.bucket.tiles.push(tile);
    });

    var newTiles = game.givePlayerTiles(player, tiles.length);

    var historyObject = {
        type: enums.moveTypes.MOVE_FOLD,
        time: new Date(),
        toBucket: tiles,
        fromBucket: newTiles
    };

    callback(null, historyObject);
};

Game.prototype.givePlayerTiles = function(player, num) {
    var game = this;
    var newTiles = game.bucket.getTiles(num);

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


function processHistoryObject(actionData) {

    var game = this;

    if (actionData.fromBucket) {
        Tile.remove(game.bucket.tiles, actionData.fromBucket);
    }

    if (actionData.toBucket) {
        Tile.remove(game.bucket.tiles, actionData.toBucket);
    }

    if (actionData.toBoard) {
        game.board.placeMove(actionData.toBoard);
        game.board.lockMove(actionData.toBoard);

        if (game.board.isEmpty) {
            game.board.isEmpty = false;
        }
    }

    return game;
};


Game.prototype.checkMoveValidity = function(move, callback) {

    var game = this;


    Multipoint.sort(move);

    if (!game.board.validCoords(move)) {
        callback({
            message: 'error: invalidCoords (outside board)'
        });
        return false;
    }

    if (!Multipoint.isAligned(move)) {
        callback({
            message: 'move is not aligned'
        });
        return false;
    }


    game.board.placeMove(move);



    var segment = game.board.lineTraverseFilled(_.first(move), _.last(move));

    // console.log(segment, move, 'segment')

    if (segment.length < move.length) {
        game.board.unplaceMove(moveData);
        callback({
            message: 'hasGaps!!!'
        });
        return false;
    }

    if (!game.board.isEmpty) {
        if (!game.board.hasFilledNeighbours(move)) {
            game.board.unplaceMove(moveData);
            callback({
                message: 'does not hasFilledNeighbours'
            });
            return false;
        }
    } else {
        if (!game.board.passesFromCenter(move)) {
            game.board.unplaceMove(moveData);
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


Game.prototype.validatePlayer = function(playerData, moveTiles) {

    var game = this;

    if (moveTiles.length > game.rackSize) {
        return {
            message: 'INVALID MOVE TILES'
        };
    }


    var player = game.getPlayingUser();

    if (!Player.compare(player, playerData)) {
        return {
            message: playerData.id + ' wrong player... now playing: ' + player.id
        };
    }

    if (!Player.playerHasValidTiles(player, moveTiles)) {

        return {
            moveTiles: moveTiles,
            playerTiles: player.tiles,
            message: 'tiles do not belong to player'
        };
    }

    return true;

};


Game.prototype.receiveMove = function(playerData, moveData, callback) {
    var game = this;

    // callback = typeof callback == 'function' ? callback : emptyFunction;

    var moveTiles = Tile.extract(moveData);

    var player = game.getPlayingUser();
    var validation;

    // VALIDATION

    validation = game.validatePlayer(playerData, moveTiles)

    if (validation !== true) {
        callback(validation);
        return false;
    }


    game.checkMoveValidity(moveData, function(moveErr, moveValidationResult) {

        if (moveErr) {
            callback(moveErr, moveValidationResult);
            return false;
        }


        var words = game.board.getWords(moveData);

        Word.wordsExist(words, function(wordsErr, wordsResult) {

            if (wordsErr) {
                callback(wordsErr);
            }

            var result = game.calculateMovePoints(moveData)

            player.points += result.points;
            game.removePlayerTiles(player, moveTiles);
            var newTiles = game.givePlayerTiles(player, moveData.length);

            game.board.lockMove(moveData);

            if (game.board.isEmpty) {
                game.board.isEmpty = false;
            }

            game.giveTurn();

            var historyObject = {
                time: new Date(),
                type: enums.moveTypes.MOVE_WORD,
                toBoard: moveData,
                fromBucket: newTiles,
                player: playerData,
                result: result
            };

            game.history.push(historyObject);

            callback(null, historyObject);

        });

    });

};


function emptyFunction() {};


module.exports = Game;
