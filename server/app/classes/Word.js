'use strict';

var squareScopes = require('../data/enumerators').squareScopes;

function Word() {};

Word.calculatePoints = function(placeholders) {

    var sum = 0;
    var wordCallbacks = [];
    var results = [];

    placeholders.forEach(function(placeholder) {

        // console.log(placeholder.square.type, placeholder.tile.points, 'calculation-log...');

        if (placeholder.locked) {

            sum += placeholder.tile.points;

        } else if (placeholder.square.scope === squareScopes.SCOPE_LETTER) {

            sum += placeholder.square.calculate(placeholder.tile.points).points;

        } else if (placeholder.square.scope === squareScopes.SCOPE_WORD) {

            sum += placeholder.tile.points;
            wordCallbacks.push(placeholder.square.calculate);
        }

        console.log('..' + placeholder.tile.points + '-->' + sum);
    });

    wordCallbacks.forEach(function(wordCalculation) {
        sum = wordCalculation(sum).points;
    });

    return sum;
};

Word.makeString = function(word) {

};

Word.wordsExist = function(words, callback) {
    var result = words.every(function(word) {
        return Word.exists(word);
    });

    if (result) {
        callback();
    } else {
        callback({
            message: 'words do not exist'
        });
    }
};

Word.exists = function(word) {
    return true;
};

Word.log = function(word) {
    return word.map(function(placeholder) {
        return placeholder.tile.letter + '(' + placeholder.tile.points + ',' + placeholder.square.class + ',' + (placeholder.locked ? 'L' : 'P') + ')';
    }).join('|');
};

module.exports = Word;
