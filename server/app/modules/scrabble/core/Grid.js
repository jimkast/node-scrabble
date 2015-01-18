'use strict';

// var Multipoint = require('./Multipoint');
// var directions = require('../data/enumerators').directions;


function Grid() {
    this.data = [];
};


Grid.prototype.getCenter = function() {
    return this.get(Math.ceil(this.data[0].length / 2), Math.ceil(this.data.length / 2));
};

Grid.prototype.isCenter = function(point) {
    var center = this.getCenter();
    return point.x === center.x && point.y === center.y;
};


Grid.prototype.build = function(totalColumns, totalRows, pointCallback, rowCallback, finalCallback) {

    var grid = [];
    totalRows = totalRows || 1;
    pointCallback = pointCallback || emptyFunction;
    rowCallback = rowCallback || emptyFunction;
    finalCallback = finalCallback || emptyFunction;

    for (var i = 0; i < totalRows; i++) {
        var row = [];
        for (var j = 0; j < totalColumns; j++) {
            var point = {
                x: j,
                y: i
            };
            pointCallback(point);
            row.push(point);
        }
        rowCallback(row);
        grid.push(row);
    }

    finalCallback(grid);
    return this.data = grid;
};


Grid.prototype.size = function() {
    return {
        x: this.data[0].length,
        y: this.data.length
    };
};

Grid.prototype.get = function(x, y) {

    if (typeof x === 'object') {
        // return Grid.prototype.get.call(this, x.x, x.y);
        return this.get(x.x, x.y);
    };

    if (x >= 0 && y >= 0) {

        return this.data[y][x];

    } else if (y >= 0) {

        return this.data[y];

    } else if (x >= 0) {
        var col = [];
        this.data.forEach(function(row) {
            col.push(row[x]);
        });
        return col;

    } else {

        return this.data;

    }
};


Grid.prototype.getNeighbours = function(point) {

    var neighbours = [];
    var size = this.size();

    if (point.x > 0) {
        neighbours.push(this.get(point.x - 1, point.y));
    }
    if (point.x < size.x - 1) {
        neighbours.push(this.get(point.x + 1, point.y));
    }

    if (point.y > 0) {
        neighbours.push(this.get(point.x, point.y - 1));
    }

    if (point.y < size.x - 1) {
        neighbours.push(this.get(point.x, point.y + 1));
    }

    return neighbours;
};


Grid.prototype.validCoords = function(pointsArray) {
    var grid = this;

    if (!(pointsArray instanceof Array)) {
        pointsArray = [pointsArray];
    }

    return pointsArray.every(function(point) {
        return !invalidCoords.call(grid, point.x, point.y);
    });

};

function invalidCoords(x, y) {
    return x < 0 || y < 0 || x >= this.data[0].length || y >= this.data.length;
};


Grid.prototype.prev = function(point, verticalDirection) {};


// Grid.prototype.reflection = function(point, symmetryType) {

//     var grid = this;
//     var coords;

//     if (point instanceof Array) {
//         var arr = [];
//         point.forEach(function(p) {
//             arr.push(grid.reflection(p));
//         });
//         return arr;
//     }

//     if (symmetryType === directions.DIR_VERTICAL) {
//         coords = {
//             x: point.x,
//             y: grid.size().y - point.y - 1
//         };
//     } else if (symmetryType === directions.DIR_DIAGONAL) {
//         coords = {
//             x: point.y,
//             y: point.x
//         };
//     } else {
//         coords = {
//             x: grid.size().x - point.x - 1,
//             y: point.y
//         };
//     }

//     return grid.get(coords);

// };



Grid.prototype.distanceOf = function(point1, point2, verticalDirection) {

    var majorCoord, minorCoord;
    var size = this.size();

    if (verticalDirection) {
        majorCoord = 'x';
        minorCoord = 'y';
    } else {
        majorCoord = 'y';
        minorCoord = 'x';
    }

    return (point1[majorCoord] - point2[majorCoord]) * size[minorCoord] - point1[minorCoord] + point2[minorCoord];

};



Grid.prototype.jumpTo = function(startPoint, distance, verticalDirection) {

    var result;
    var coords = {};
    var size = this.size();
    var moveCoord, standCoord;

    if (verticalDirection) {
        moveCoord = 'y';
        standCoord = 'x';
    } else {
        moveCoord = 'x';
        standCoord = 'y';
    }

    result = startPoint[moveCoord] + distance;

    coords[moveCoord] = result % size[moveCoord];
    coords[standCoord] = startPoint[standCoord] + Math.floor(result / size[moveCoord]);

    // if (!this.validCoords(coords)) {
    //     return null;
    // }

    return this.get(coords);
};


Grid.prototype.prev = function(point, verticalDirection) {
    return this.jumpTo(point, -1, verticalDirection);
};

Grid.prototype.next = function(point, verticalDirection) {
    return this.jumpTo(point, 1, verticalDirection);
};


Grid.prototype.traverse = function(startPoint, endPoint, matchFunction, traverseVertically, excludeStart) {

    var grid = this;

    matchFunction = typeof matchFunction === 'function' ? matchFunction : function() {
        return true;
    }

    if (!grid.validCoords([startPoint, endPoint])) {
        return [];
    }

    var nextPoint;
    var currentGridPoint = grid.get(startPoint);
    var result = [];
    var isValid = true;
    var distance = grid.distanceOf(startPoint, endPoint, traverseVertically);
    var distanceAbs = Math.abs(distance);
    var inverse = distance < 0;

    if (inverse) {
        nextPoint = function() {
            currentGridPoint = grid.prev(currentGridPoint, traverseVertically);
        };
    } else {
        nextPoint = function() {
            currentGridPoint = grid.next(currentGridPoint, traverseVertically);
        };
    }



    if (excludeStart) {
        nextPoint();
        distanceAbs--;
    }

    for (var i = 0; i <= distanceAbs && isValid; i++) {
        if (isValid = matchFunction(currentGridPoint, i)) {
            result.push(currentGridPoint);
            nextPoint();
        }
    }

    if (inverse) {
        result.reverse();
    }

    return result;
};

Grid.prototype.lineTraverse = function(startPoint, endPoint, matchFunction, excludeStart) {
    return this.traverse(startPoint, endPoint, matchFunction, startPoint.x === endPoint.x, excludeStart);
};


Grid.prototype.rowStart = function(point) {
    return this.get(0, point.y);
};

Grid.prototype.rowEnd = function(point) {
    return this.get(this.size().x - 1, point.y);
};

Grid.prototype.columnStart = function(point) {
    return this.get(point.x, 0);
};

Grid.prototype.columnEnd = function(point) {
    return this.get(point.x, this.size().y - 1);
};



// Grid.prototype.traverseColumn = function(point, matchFunction, reverse, excludeStart) {

//     var grid = this;

//     var endPoint = {
//         x: point.x,
//         y: reverse ? 0 : grid.size().y - 1
//     };

//     return grid.traverse(point, endPoint, matchFunction, excludeStart);
// };


// Grid.prototype.traverseRow = function(point, matchFunction, reverse, excludeStart) {

//     var grid = this;

//     var endPoint = {
//         x: reverse ? 0 : grid.size().x - 1,
//         y: point.y
//     };

//     return grid.traverse(point, endPoint, matchFunction, excludeStart);
// };

function emptyFunction() {};


module.exports = Grid;
