'use strict';

var mongoose = require('mongoose'),
    Game = mongoose.model('Game');


exports.get = Game.find;
exports.create = Game.create;
