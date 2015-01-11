'use strict';

var enums = require('../data/enumerators'),
    directions = enums.directions,
    squareScopes = enums.squareScopes;


function Move(placeholders) {
    this.placeholders = placeholders.sort(placeholdersSorting);
    this.direction = getDirection(placeholders);
};



Move.prototype.hasGaps = function() {

    var move = this;
    var key;

    if (move.direction === directions.DIR_VERTICAL) {
        key = 'y';
    } else {
        key = 'x';
    }

    return move.placeholders.some(function(pl, index) {
        if (index > 0) {
            return pl[key] - move.placeholders[index - 1][key] !== 1;
        }
        return false;
    });

};


Move.prototype.isAligned = function() {

    var arr = this.placeholders;

    var curRow = arr[0].y;
    var curCol = arr[0].x;
    var isAligned = true;

    arr.forEach(function(placeholder) {
        isAligned = isAligned && (placeholder.y == curRow || placeholder.x == curCol);
    });

    return isAligned;
};


Move.prototype.isValid = function(emptyBoard) {
    var move = this;
    var connectFunction = emptyBoard ? firstMoveCheck : isConnected;
    var result = move.isAligned() && !move.hasGaps() && connectFunction(); //&& wordExists();
    return result;
};

Move.prototype.calculate = function() {
    var move = this;
    return calculatePoints(move.placeholders);
};


Move.calculatePoints = calculatePoints;

function calculatePoints(placeholders) {

    var sum = 0;
    var wordCallbacks = [];
    var results = [];

    placeholders.forEach(function(placeholder) {

        console.log(placeholder.square.type, placeholder.tile.points, 'calculation-log...');

        if (!placeholder.isPlaced()) {

            sum += placeholder.tile.points;

        } else if (placeholder.square.scope === squareScopes.SCOPE_LETTER) {

            sum += placeholder.square.calculate(placeholder.tile.points).points;

        } else if (placeholder.square.scope === squareScopes.SCOPE_WORD) {

            sum += placeholder.tile.points;
            wordCallbacks.push(placeholder.square.calculate);
        }
    });

    wordCallbacks.forEach(function(wordCalculation) {
        sum = wordCalculation(sum).points;
    });

    return sum;
};


function getDirection(placeholders) {

    var dir;

    if (placeholders.length === 1) {
        dir = directions.DIR_HORIZONTAL;
    } else if (placeholders[0].x === placeholders[1].x) {
        dir = directions.DIR_VERTICAL;
    } else if (placeholders[0].y === placeholders[1].y) {
        dir = directions.DIR_HORIZONTAL;
    } else {
        // NO DIR!!!
        dir = directions.DIR_HORIZONTAL;
    }

    return dir;
};



function placeholdersSorting(prev, next) {
    var diff = prev.y - next.y;

    if (diff === 0) {
        diff = prev.x - next.x;
    }

    return diff;
};


module.exports = Move;
