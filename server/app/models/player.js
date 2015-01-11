'use strict';

var mongoose = require('mongoose'),
    // Player = mongoose.model('Player'),
    Schema = mongoose.Schema;


var PlayerSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },

    name: {
        type: String,
        default: Math.random().toString()
    },

    age: {
        type: Number
    }

});

mongoose.model('Player', PlayerSchema);
