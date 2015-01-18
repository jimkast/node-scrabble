'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Model = mongoose.model('User');


module.exports = {

    list: function(req, res, next) {

        var query = req.query;

        Model.find(query, function(err, data) {
            if (err) {
                res.status(400).json(err);
            } else {
                res.json(data);
            }
        });

    },


    getById: function(req, res, next) {

        var id = req.param('id');

        Model.findById(id, function(err, data) {
            if (err) {
                res.status(400).json(err);
            } else {
                res.json(data);
            }
        });

    },



    remove: function(req, res, next) {

        var id = req.param('id');

        Model.findById(id, function(findErr, game) {
            game.enabled = false;

            if (findErr) {
                res.status(400).json(findErr);
                return;
            }

            game.save(function(saveErr, savedGame) {
                if (findErr) {
                    res.status(400).json(findErr);
                } else {
                    res.json(savedGame);
                }

            });
        });

    },



    create: function(req, res, next) {

        var obj = new Model(req.body);

        obj.save(function(err) {
            if (err) {
                return res.status(400).send(err);
            } else {
                res.json(obj);
            }
        });

    },

    update: function(req, res, next) {



    }

};
