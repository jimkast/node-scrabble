'use strict';

var Placeholder = require('./Placeholder'),
    directions = require('../data/enumerators').directions;

function BoardPlaceholder(square, tile, x, y) {

    var that = new Placeholder(square, tile);

    that.x = x;
    that.y = y;


    that.getRow = function(){
        return that.y;
    };

    that.getColumn = function(){
        return that.x;
    };



    that.prev = function(direction) {
        if (direction === directions.DIR_VERTICAL) return that.top;
        else return that.left;
    };

    that.next = function(direction) {
        if (direction === directions.DIR_VERTICAL) return that.bottom;
        else return that.right;
    };




    var getNeighbours = function(checkFunction) {

        checkFunction = typeof checkFunction === 'function' ? checkFunction : function() {
            return true;
        };

        var neighbours = [];
        var arr = [that.top, that.right, that.bottom, that.left];
        arr.forEach(function(placeholder) {
            if (placeholder && checkFunction(placeholder)) {
                neighbours.push(placeholder);
            }
        });
        return neighbours;
    };

    that.getAllNeightbours = function() {
        return getNeighbours();
    };

    that.getPlacedNeighbours = function() {
        return getNeighbours(function(placeholder) {
            return placeholder.isPlaced();
        });
    };

    that.getEmptyNeighbours = function() {
        return getNeighbours(function(placeholder) {
            return placeholder.isEmpty();
        });
    };

    that.hasPlacedNeighbours = function() {
        return that.getPlacedNeighbours().length > 0;
    };

    that.hasEmptyNeighBours = function() {
        return that.getEmptyNeighbours().length === 4;
    };



    that.setAsBoardCenter = function() {
        that.boardCenter = true;
    };

    that.isBoardCenter = function() {
        return that.boardCenter == true;
    };



    that.getRaw = function() {
        return {
            square: square.getRaw(),
            tile: that.tile,
            x: that.x,
            y: that.y
        }
    };


    return that;
};


module.exports = BoardPlaceholder;
