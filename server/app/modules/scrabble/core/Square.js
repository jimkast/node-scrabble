'use strict';

var _ = require('lodash'),
    enums = require('./enumerators'),
    squareTypes = enums.squareTypes,
    squareScopes = enums.squareScopes;

var squareBuilder = {};
// var calculateFunctions = {};

// calculateFunctions[squareTypes.SQUARE_SIMPLE] = function(letterPoints) {
//     return {
//         points: letterPoints
//     };
// };

// calculateFunctions[squareTypes.SQUARE_LETTER_DOUBLE] = function(letterPoints) {
//     return {
//         points: letterPoints * 2,
//         string: 'x2'
//     };
// };

// calculateFunctions[squareTypes.SQUARE_LETTER_TRIPLE] = function(letterPoints) {
//     return {
//         points: letterPoints * 3,
//         string: 'x3'
//     };
// };

// calculateFunctions[squareTypes.SQUARE_WORD_DOUBLE] = function(wordPoints) {
//     return {
//         points: wordPoints * 2,
//         string: 'x2'
//     };
// };

// calculateFunctions[squareTypes.SQUARE_WORD_TRIPLE] = function(wordPoints) {
//     return {
//         points: wordPoints * 3,
//         string: 'x3'
//     };
// };


function multiplierFactory(multiplier) {
    return function(points) {
        return {
            points: points * multiplier,
            string: 'x' + multiplier
        };
    };
};


squareBuilder[squareTypes.SQUARE_SIMPLE] = function() {
    return {
        type: squareTypes.SQUARE_SIMPLE,
        class: 's0',
        scope: squareScopes.SCOPE_LETTER,
        calculate: multiplierFactory(1)
    };
};

squareBuilder[squareTypes.SQUARE_LETTER_DOUBLE] = function() {
    return {
        type: squareTypes.SQUARE_LETTER_DOUBLE,
        class: 's1',
        scope: squareScopes.SCOPE_LETTER,
        calculate: multiplierFactory(2)
    };
};

squareBuilder[squareTypes.SQUARE_LETTER_TRIPLE] = function() {
    return {
        type: squareTypes.SQUARE_LETTER_TRIPLE,
        class: 's2',
        scope: squareScopes.SCOPE_LETTER,
        calculate: multiplierFactory(3)
    };
};

squareBuilder[squareTypes.SQUARE_WORD_DOUBLE] = function() {
    return {
        type: squareTypes.SQUARE_WORD_DOUBLE,
        class: 's3',
        scope: squareScopes.SCOPE_WORD,
        calculate: multiplierFactory(2)
    };
};

squareBuilder[squareTypes.SQUARE_WORD_TRIPLE] = function() {
    return {
        type: squareTypes.SQUARE_WORD_TRIPLE,
        class: 's4',
        scope: squareScopes.SCOPE_WORD,
        calculate: multiplierFactory(3)
    };
};



function Square(type) {
    _.extend(this, squareBuilder[type]());
    // this.calculate = calculateFunctions[type];
};


module.exports = Square;
