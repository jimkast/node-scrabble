'use strict';

var _ = require('lodash');


function getLanguagePack(languageCode) {
    return require('./language-packs/' + languageCode + '.json');
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

    that.getTiles = function(count) {
        return removeRandom(that.tiles, count);
    };

};



function removeRandom(array, count) {

    var result = [];
    count = count || 1;

    for (var i = 0; i < count; i++) {

        var index = _.random(0, array.length - 1);
        result.push(array[index]);
        array.splice(index, 1);
    }

    return result;

};

module.exports = Bucket;
