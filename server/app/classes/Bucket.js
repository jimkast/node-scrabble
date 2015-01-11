'use strict';

var _ = require('lodash');


function getLanguagePack(languageCode) {
    return require('../data/language-packs/' + languageCode + '.json');
};


function Bucket(languageCode) {

    var that = this;

    var languagePack = getLanguagePack(languageCode);

    function generateBucket() {

        var lettersArray = languagePack.letterSetup;

        var arr = [];
        var counter = 0;

        lettersArray.forEach(function(letterConfig) {

            for (var i = 0; i < letterConfig.total; i++) {
                
                var letterObject = {};
                _.assign(letterObject, letterConfig, {
                    id: counter++
                });
                arr.push(letterObject);
            }
        });

        return arr;
    };


    that.tiles = generateBucket();
    that.size = that.tiles.length;

};

module.exports = Bucket;
