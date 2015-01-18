'use strict';

var directions = require('./enumerators').directions;


function Multipoint(pointsArray) {};


Multipoint.compare = function(point1, point2) {
    var diff = point1.y - point2.y;
    return diff === 0 ? point1.x - point2.x : diff;
};


Multipoint.sort = function(pointsArray) {
    return pointsArray.sort(Multipoint.compare);
};

Multipoint.hasGaps = function(pointsArray) {

    var key;
    var direction = Multipoint.getDirection(pointsArray);
    var pointsSorted = Multipoint.sort(pointsArray);

    key = direction === directions.DIR_VERTICAL ? 'y' : 'x';

    return pointsSorted.some(function(point, index) {
        return index === 0 ? false : point[key] - pointsSorted[index - 1][key] !== 1;
    });
};


function calcSlope(point1, point2) {
    return (point1.y - point2.y) / (point1.x - point2.x);
};

Multipoint.isLine = function(pointsArray) {

    if (pointsArray.length < 2) {
        return true;
    }

    var slope = calcSlope(pointsArray[1], pointsArray[0]);

    return !pointsArray.some(function(point) {
        return index === 0 ? false : slope !== calcSlope(point, pointsArray[0]);
    });
};

Multipoint.isAligned = function(pointsArray) {

    var row = pointsArray[0].y;
    var col = pointsArray[0].x;

    return !pointsArray.some(function(point) {
        return point.y !== row && point.x !== col;
    });
};

Multipoint.getDirection = function(pointsArray) {

    var dir;

    if (pointsArray.length === 1) {
        dir = directions.DIR_HORIZONTAL;
    } else if (pointsArray[0].x === pointsArray[1].x) {
        dir = directions.DIR_VERTICAL;
    } else if (pointsArray[0].y === pointsArray[1].y) {
        dir = directions.DIR_HORIZONTAL;
    } else {
        // NO DIR!!!
        dir = directions.DIR_HORIZONTAL;
    }

    return dir;
};


module.exports = Multipoint;
