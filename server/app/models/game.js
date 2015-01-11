'use strict';

var mongoose = require('mongoose'),
    // Player = mongoose.model('Player'),
    Schema = mongoose.Schema;


var GameSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },

    size: {
        type: Number
    },

    bucket: {
        type: Object
    },

    board: {
        type: Object
    },

    players: {
        type: []
    },

    foldCounter: {
        type: Number
    },
    
    playingUser: {
        type: Number
    }

});

mongoose.model('Game', GameSchema);
