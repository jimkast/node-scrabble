//exports.squareTypes = ['s1', 's2', 's3', 's4'];

exports.directions = {
    'DIR_HORIZONTAL': 1,
    'DIR_VERTICAL': 2,
    'DIR_DIAGONAL': 3
};

exports.squareTypes = {
    'SQUARE_SIMPLE': 1,
    'SQUARE_LETTER_DOUBLE': 2,
    'SQUARE_LETTER_TRIPLE': 3,
    'SQUARE_WORD_DOUBLE': 4,
    'SQUARE_WORD_TRIPLE': 5
};

exports.squareScopes = {
    'SCOPE_LETTER': 1,
    'SCOPE_WORD': 2
};


exports.gameState = {
    'WAITING': 1,
    'STARTED': 2,
    'FINISHED': 3
};


exports.gameStates = {
    'GAME_WAITING_FOR_PLAYERS': 1,
    'GAME_STARTED': 2,
    'GAME_FINISHED': 3,
    'GAME_DELETED': 4
};


exports.moveTypes = {
    'MOVE_WORD': 1,
    'MOVE_FOLD': 2,
    'GAME_STARTED': 3,
    'GAME_FINISHED': 3
};
