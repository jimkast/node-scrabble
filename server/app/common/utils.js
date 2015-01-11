'use strict';

var _ = require('lodash');

function makeRaw(object) {

    var obj;

    var type = typeof object;

    if (object instanceof Array) {

        obj = [];

        object.forEach(function(item) {
            obj.push(makeRaw(item));
        });

    } else if (type === 'object' && object !== null) {

        obj = {};

        Object.keys(object).forEach(function(key) {
            obj[key] = makeRaw(object[key]);
        });

    } else if (type !== 'function') {

        obj = object;

    } else {

        obj = undefined;

    }

    return obj;

};


exports.makeRaw = makeRaw;


exports.removeRandom = function(array, count) {

	var result = [];
    count = count || 1;

    for (var i = 0; i < count; i++) {

        var index = _.random(0, array.length - 1);
        result.push(array[index]);
        array.splice(index, 1);
    }

    return result;

};


exports.putRandom = function(targetArray, sourceArray) {

    sourceArray.forEach(function(item){
    	targetArray.splice(_.random(0, targetArray.length - 1), 0, item);
    });

    return targetArray;

};


exports.indexOfProperty = function(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
};


exports.shuffle = function(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};


exports.Cycleable = function(array, callback, start) {

    callback = typeof callback === 'function' ? callback : function() {};

    var that = this;
    var current;
    var total = array.length;

    that.getCurrent = function() {
        return array[current];
    };

    that.getTotal = function() {
        return total;
    };

    that.goTo = function(index) {

        if (index < 0) {
            index = total + index;
        };

        if (index >= total) {
            index = index - total;
        };

        index = index && Math.min(total - 1, index) || 0
        current = index;

        callback(index, array[index]);

        return array[index];
    };

    that.next = function() {
        return that.goTo(current + 1);
    };

    that.prev = function() {
        return that.goTo(current - 1);
    };

    that.add = function(item) {
        total = array.push(item);
        return that;
    };

    that.removeByIndex = function(index) {

        array.splice(index, 1);
        total--;
        if (current === index) {
            that.goTo(current + 1);
        };
        return that;
    };

    that.removeByProperty = function(property, value) {
        var idx = utils.indexOfProperty(array, property, value);

        if (idx >= 0) {
            that.removeByIndex(idx);
        }

        return that;
    };

    that.removeByValue = function(value) {
        var idx = array.indexOf(value);

        if (idx >= 0) {
            that.removeByIndex(idx);
        }

        return that;
    };

    that.goTo(start || 0);
};
