'use strict';

var _ = require('lodash');

function Tile(letter, points, alias) {
    this.letter = letter;
    this.points = points;
    this.alias = alias;
};

Tile.extract = function(placeholders) {
    return placeholders.map(function(pl) {
        return pl.tile;
    });
};


Tile.remove = function(tilesArray, tilesToRemove) {

    if (!(tilesToRemove instanceof Array)) {
        tilesToRemove = [tilesToRemove];
    }

    tilesToRemove.forEach(function(tile) {
        var idx = _.findIndex(tilesArray, {
        	letter: tile.letter
        });
        if (idx > -1) {
            tilesArray.splice(idx, 1);
        }
    });

    return tilesArray;
};

Tile.compare = function(tile1, tile2) {
    return tile1.letter === tile2.letter;
};

module.exports = Tile;
