'use strict';

var mongoose = require('mongoose'),
    // Player = mongoose.model('Player'),
    Schema = mongoose.Schema;


var GameSchema = new Schema({

    enabled: {
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    createdBy: {
        type: Object
    },

    state: {
        type: Number
    },

    size: {
        type: Number
    },

    rackSize: {
        type: Number
    },

    langPack: {
        type: String
    },

    boardType: {
        type: String
    },

    players: {
        type: []
    },

    playingState: {
        type: Object
    },

    history: {
        type: []
    }

});

mongoose.model('Game', GameSchema);
