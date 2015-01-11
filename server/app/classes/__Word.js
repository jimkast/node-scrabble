'use strict';

var directions = require('../data/enumerators').squareScopes;

function Word(placeholders) {

    var that = this;

    that.placeholders = placeholders;
    that.points = 0;

    var calculationCallback;

    that.setCalculationCallback = function(callback) {
        calculationCallback = callback;
    };


    that.getLength = function() {
        return placeholders.length;
    };

    that.getPoints = function() {
        return that.points;
    };

    that.wordExists = function() {
        // Check if word is in database
        console.log(true, 'WORD EXISTS');
        return true;
    };


    var parseWord = function(wordCallback) {

        var index = 0;
        var pointsCounter = 0;
        var wordCallbackFunctions = [];
        var calcStr = '';
        var str = '';

        // Find first word start


        that.placeholders.forEach(function(curPlaceholder) {

            var tilePoints = 0;
            var squareType = curPlaceholder.getType();
            var tile = curPlaceholder.getTile();

            str += curPlaceholder.getLetter();
            if (index++ > 0) {
                calcStr += ' + ';
            }
            calcStr += curPlaceholder.getPoints();

            if (curPlaceholder.isPlaced()) {

                tilePoints = curPlaceholder.getPoints();

            } else {

                if (squareType.scope == squareScopes.SCOPE_LETTER && typeof squareType.func === 'function') {

                    var funcResult = squareType.func(curPlaceholder.getPoints());
                    tilePoints = funcResult.points;
                    calcStr += funcResult.string;

                } else if (squareType.scope == squareScopes.SCOPE_WORD && typeof squareType.func === 'function') {

                    tilePoints = curPlaceholder.getPoints();
                    wordCallbackFunctions.push(squareType.func);

                } else {

                    tilePoints = curPlaceholder.getPoints();

                }
            }

            pointsCounter += tilePoints;

        });

        if (typeof calculationCallback === 'function') {
            wordCallbackFunctions.push(calculationCallback);
        }

        if (wordCallbackFunctions.length > 0) {
            calcStr = ' (' + calcStr + ') ';
            wordCallbackFunctions.forEach(function(func) {
                var funcResult = func(pointsCounter);
                pointsCounter = funcResult.points;
                calcStr += funcResult.string;
            });
        }


        if (typeof wordCallback === 'function') {
            calcStr = '(' + calcStr + ')';
            wordCallbackFunctions.forEach(function(func) {
                var funcResult = func(pointsCounter);
                pointsCounter = funcResult.points;
                calcStr += funcResult.string;
            });
        }

        return {
            'string': str,
            'points': pointsCounter,
            'calcString': calcStr
        }

    };


    that.parse = function(wordCallback) {
        // Check if word exists
        var results = parseWord(wordCallback);
        that.results = results;
        that.points = results.points;
        return results;
    };

};


module.exports = Word;