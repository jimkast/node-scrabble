'use strict';

function Placeholder(square, tile, x, y) {

    this.square = square;
    this.tile = tile;

    this.x = x;
    this.y = y;

};



Placeholder.prototype = {

    isFilled: function() {
        if (this.tile) return true;
        return false;
    },

    isEmpty: function() {
        return !this.isFilled();
    },

    position: function() {
        return {
            x: this.x,
            y: this.y
        };
    },

    setAsBoardCenter: function() {
        this.center = true;
        return this;
    },

    isBoardCenter: function() {
        return this.center;
    },

    placeTile: function(tile) {
        this.tile = tile;
        this.locked = true;
        return this;
    },

    unplaceTile: function() {
        var tile = this.tile;
        this.tile = null;
        this.locked = false;
        return tile;
    },

    isPlaced: function() {
        return this.locked;
    },

    removeTile: function() {
        var tile = this.tile;
        this.tile = null;
        return tile;
    }
};


module.exports = Placeholder;
