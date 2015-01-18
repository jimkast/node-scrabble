'use strict';

var _ = require('lodash');
var Tile = require('./Tile');

function Player() {};

Player.compare = function(player1, player2) {
    return player1.id === player2.id;
};

Player.playerHasValidTiles = function(player, tiles) {

    var playerTiles = player.tiles.slice();

    return tiles.every(function(moveTile) {

        var indexFound;
        var found = playerTiles.some(function(playerTile, index) {

            if (Tile.compare(playerTile, moveTile)) {
                indexFound = index;
                return true;
            }
        });

        if (found) {
            playerTiles.splice(indexFound, 1);
        }

        return found;

    });
};


Player.sortByPoints = function(players) {
    return players.slice().sort(function(a, b) {
        return b.points - a.points;
    });
};


Player.find = function(array, player) {
    return _.find(array, {
        id: player.id
    })
};


Player.remove = function(array, player) {
    var index = _.findIndex(array, {
        id: player.id
    });

    if (index >= 0) {
        array.splice(index, 1);
        return true;
    }
    return false;
};

module.exports = Player;
