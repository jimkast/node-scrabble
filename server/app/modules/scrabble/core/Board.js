'use strict';

var _ = require('lodash'),
    enums = require('./enumerators'),
    directions = enums.directions,
    squareTypes = enums.squareTypes,
    Square = require('./Square'),
    Multipoint = require('./Multipoint'),
    Grid = require('./Grid');



function Board(boardType) {
    this.boardType = boardType;
    _.extend(this, new Grid());
    this.isEmpty = true;
};


Board.prototype = _.extend({}, Grid.prototype);


function loadBoardConfig(boardType) {
    var defaultBoard = 'default';

    boardType = typeof boardType === 'string' ? boardType : defaultBoard;

    try {
        return require('./boards/' + boardType);
    } catch (e) {
        return require('./boards/' + defaultBoard);
    };
};

Board.prototype.build = function() {

    var buildConfig = loadBoardConfig(this.boardType).data;

    var squareObjects = [
        new Square(squareTypes.SQUARE_SIMPLE),
        new Square(squareTypes.SQUARE_LETTER_DOUBLE),
        new Square(squareTypes.SQUARE_LETTER_TRIPLE),
        new Square(squareTypes.SQUARE_WORD_DOUBLE),
        new Square(squareTypes.SQUARE_WORD_TRIPLE)
    ];

    return Grid.prototype.build.call(this, buildConfig[0].length, buildConfig.length, function(point) {
        var pointConfig = buildConfig[point.y][point.x];
        _.extend(point, {
            square: squareObjects[pointConfig.type]
        });
    });

};


Board.prototype.getFilledNeighbours = function(point) {
    return this.getNeighbours(point).filter(function(placeholder) {
        return placeholder.tile && placeholder.locked;
    });
};


Board.prototype.hasFilledNeighbours = function(placeholders) {

    var board = this;

    if (placeholders instanceof Array) {
        return placeholders.some(function(pl) {
            return board.hasFilledNeighbours(pl)
        });
    }

    return !!board.getFilledNeighbours(placeholders).length;
};


Board.prototype.getWordFromPoint = function(point, direction) {

    var board = this;
    var word, prefix, postfix, direction, rowStart, rowEnd, traverseVertically;

    if (direction === directions.DIR_VERTICAL) {
        rowStart = board.columnStart(point);
        rowEnd = board.columnEnd(point);
    } else {
        rowStart = board.rowStart(point);
        rowEnd = board.rowEnd(point);
    }

    prefix = board.lineTraverse(point, rowStart, hasTile, true);
    postfix = board.lineTraverse(point, rowEnd, hasTile);

    word = prefix.concat(postfix);

    if (word.length < 2) {
        return null;
    }

    return word;
};


Board.prototype.traverseFilled = function(startPoint, endPoint, traverseVertically, excludeStart) {
    return this.traverse(startPoint, endPoint, hasTile, traverseVertically, excludeStart);
};

Board.prototype.lineTraverseFilled = function(startPoint, endPoint, excludeStart) {
    return this.lineTraverse(startPoint, endPoint, hasTile, excludeStart);
};


Board.prototype.getWords = function(pointsArray) {

    var board = this;

    var words = [];
    var mainDirection = Multipoint.getDirection(pointsArray);
    var oppositeDirection = getOppositeDirection(mainDirection);

    var mainWord = board.getWordFromPoint(pointsArray[0], mainDirection);

    if (mainWord) {

        words.push(mainWord);

        pointsArray.forEach(function(point) {
            var word = board.getWordFromPoint(point, oppositeDirection);
            if (word) {
                words.push(word);
            }
        });
    }

    return words;
};


Board.prototype.placeMove = function(placeholders) {

    var board = this;

    placeholders.forEach(function(point) {
        board.get(point).tile = point.tile;
    });

    return board;
};



Board.prototype.lockMove = function(placeholders) {

    var board = this;

    placeholders.forEach(function(point) {
        board.get(point).locked = true;
    });

    return board;
};


Board.prototype.unplaceMove = function(pointsArray) {
    var board = this;
    pointsArray.forEach(function(point) {
        board.get(point.x, point.y).tile = null;
    });

    // TODO how to handle empty board if undo move occurs
    // if(board.isEmpty){
    //     board.isEmpty = false;
    // }

    return board;
};


Board.prototype.passesFromCenter = function(pointsArray) {
    var board = this;
    return pointsArray.some(function(point) {
        return board.isCenter(point);
    });
};


function getOppositeDirection(direction) {
    if (direction === directions.DIR_HORIZONTAL) return directions.DIR_VERTICAL;
    return directions.DIR_HORIZONTAL;
};

function hasTile(point) {
    return point.tile ? true : false;
};


module.exports = Board;
