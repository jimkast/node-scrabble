'use strict';

var enums = require('../data/enumerators'),
    directions = enums.directions,
    squareTypes = enums.squareTypes,
    Square = require('./Square'),
    Placeholder = require('./Placeholder');


function Board(buildConfig) {
    this.data = [];
    this.isEmpty = true;
};



Board.prototype.getCenter = function() {
    return this.data[this.centerX][this.centerY];
};


Board.prototype.build = function() {

    var board = this;

    var buildObj = board.buildConfig || {
        data: [
            [{
                type: 4
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 4
            }],
            [{
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0,
                tile: {
                    letter: "P",
                    id: 1,
                    class: "P",
                    points: 2
                },
                placed: true
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }],
            [{
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, ],
            [{
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, ],
            [{
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }],
            [{
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }],
            [{
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, ],
            [{
                type: 4
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 4
            }, ],
            [{
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, ],

            [{
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }],
            [{
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }],
            [{
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, ],
            [{
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, ],
            [{
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }],
            [{
                type: 4
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 4
            }]
        ]
    };

    var squareObjects = [
        new Square(squareTypes.SQUARE_SIMPLE),
        new Square(squareTypes.SQUARE_LETTER_DOUBLE),
        new Square(squareTypes.SQUARE_LETTER_TRIPLE),
        new Square(squareTypes.SQUARE_WORD_DOUBLE),
        new Square(squareTypes.SQUARE_WORD_TRIPLE)
    ];

    var arr = [];

    board.centerX = Math.ceil(buildObj.data.length / 2);
    board.centerY = Math.ceil(buildObj.data[0].length / 2);

    buildObj.data.forEach(function(row, rowIndex) {
        var newRow = [];

        row.forEach(function(column, colIndex) {
            var square = squareObjects[column.type];
            var placeholder = new Placeholder(square, undefined, colIndex, rowIndex);

            if (rowIndex === board.centerX && colIndex === board.centerY) {
                placeholder.setAsBoardCenter();
            }

            newRow.push(placeholder);
        });

        arr.push(newRow);
    });

    board.data = arr;

    return arr;
};


Board.prototype.get = function(x, y) {

    var board = this;


    if(validCoords.call(board, x, y)){
        return false;
    }

    if (x > 0 && y > 0) {

        return board.data[y][x];

    } else if (y > 0) {

        return board.data[y];

    } else if (x > 0) {
        var col = [];
        board.data.forEach(function(row) {
            col.push(row[x]);
        });
        return col;

    } else {

        return board.data;

    }
};


Board.prototype.placeMove = function(placeholders) {
    var board = this;
    placeholders.forEach(function(pl) {
        board.get(pl.x, pl.y).placeTile(pl.tile);
    });

    if (board.isEmpty) {
        board.isEmpty = false;
    }

    return board;
};


Board.prototype.unplaceMove = function(placeholders) {
    var board = this;
    placeholders.forEach(function(pl) {
        board.get(pl.x, pl.y).unplaceTile(pl.tile);
    });

    // TODO how to handle empty board if undo move occurs
    // if(board.isEmpty){
    //     board.isEmpty = false;
    // }

    return board;
};




Board.prototype.getNeighbours = function(x, y, filterFunc) {

    var board = this;

    var neighbours = [];


    if (x > 0) {
        neighbours.push(board.get(x - 1, y));

    }
    if (x < board.get(x, null).length - 1) {
        neighbours.push(board.get(x + 1, y));
    }

    if (y > 0) {
        neighbours.push(board.get(x, y - 1));
    }

    if (y < board.get(null, y).length - 1) {
        neighbours.push(board.get(x, y + 1));
    }

    if (typeof filterFunc === 'function') {
        neighbours = neighbours.filter(filterFunc);
    }

    return neighbours;
};


Board.prototype.getFilledNeighbours = function(x, y) {

    return this.getNeighbours(x, y, function(placeholder) {
        return placeholder.tile;
    });
};


Board.prototype.hasFilledNeighbours = function(placeholders) {

    var board = this;

    if (placeholders instanceof Array) {

        return placeholders.some(function(pl) {
            return board.hasFilledNeighbours(pl)
        });

    }

    var filledNeighbours = board.getFilledNeighbours(placeholders.x, placeholders.y);

    return !!filledNeighbours.length;
};


Board.prototype.getWord = function(x, y, direction) {

    var board = this;

    var row;
    var tile;
    var pointer;

    var word = [];

    var coords = board.findWordStart(x, y, direction);
    // var coords = {
    //     x: x,
    //     y: y
    // };

    if (direction == directions.DIR_VERTICAL) {
        row = board.get(x, null);
        pointer = coords.y;
    } else {
        row = board.get(null, y);
        pointer = coords.x;
    }

    while ((tile = row[pointer].tile) && pointer < row.length) {
        word.push(row[pointer]);
        pointer++;
    }

    if (word.length > 1) {
        return word;
    }

    return null;
};


function validCoords(x, y) {
    return x >= 0 && y > 0 && x < this.data[0].length && y < this.data.length;
};


Board.prototype.outOfBounds = function(placeholders) {
    var board = this;
    return placeholders.some(function(pl) {
        return !validCoords.call(board, pl.x, pl.y);
    });

};

Board.prototype.getWords = function(move) {

    var board = this;
    var words = [];

    board.placeMove(move.placeholders);

    var mainWord = board.getWord(move.placeholders[0].x, move.placeholders[0].y, move.direction);

    var oppositeDirection = getOppositeDirection(move.direction);

    if (mainWord) {

        words.push(mainWord);

        move.placeholders.forEach(function(pl) {
            var word = board.getWord(pl.x, pl.y, oppositeDirection)
            console.log('oooooooooooooo', pl.x, pl.y, word)
            if (word) {
                words.push(word);
            }
        });
    }

    return words;
};


Board.prototype.passesFromCenter = function(placeholders) {

    var board = this;

    return placeholders.some(function(pl) {
        return pl.x === board.centerX && pl.y === board.centerY;
    });

};


Board.prototype.findWordStart = function(x, y, direction) {

    var board = this;

    var row, tile, pointer, pointerParam;
    var coords = {};

    if (direction === directions.DIR_VERTICAL) {
        row = board.get(x, null);
        coords.x = x;
        pointer = y;
        pointerParam = 'y';
    } else {
        row = board.get(null, y);
        coords.y = y;
        pointer = x;
        pointerParam = 'x';
    }

    while (row[pointer].tile && pointer >= 0) {
        pointer--;
    }

    coords[pointerParam] = pointer + 1;

    console.log(coords, 'coords')

    return coords;
};


function getOppositeDirection(direction) {
    if (direction === directions.DIR_HORIZONTAL) return directions.DIR_VERTICAL;
    return directions.DIR_HORIZONTAL;
};


module.exports = Board;
