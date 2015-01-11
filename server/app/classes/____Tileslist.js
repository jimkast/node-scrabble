(function(scrabble) {

    scrabble.tilesList = function(numberOfTiles) {

        var that = this;

        this.size = numberOfTiles || 7;
        this.tiles = [];


        this.getTotal = function() {
            return that.size;
        }

        this.getRemaining = function() {
            return that.tiles.length;
        }

        this.isEmpty = function() {
            return that.getRemaining() <= 0;
        }

        this.pickTile = function(tilePosition) {
            var currentLast = that.getRemaining() - 1;
            if (tilePosition !== parseInt(tilePosition)) {
                tilePosition = that.indexOf(tilePosition);
            }
            var pos = tilePosition >= 0 && tilePosition <= currentLast ? tilePosition : currentLast;
            return that.tiles.splice(pos, 1)[0];
        }

        this.popTile = function() {
            return that.tiles.pop();
        }

        this.pushTile = function(tile) {
            return that.tiles.push(tile);
        }

        this.pickTiles = function(num) {
            var arr = [];
            var tilesToPick = Math.min(num, that.getRemaining());
            for (var i = 0; i < tilesToPick; i++) {
                arr.push(that.pickTile());
            }
            return arr;
        }

        this.pushTiles = function(tiles) {
            var newLength = 0;
            tiles.forEach(function(tile) {
                that.pushTile(tile);
            });
            return that.getRemaining();
        }

        this.indexOf = function(tile) {
            return that.tiles.indexOf(tile);
        }

        this.get = function(index) {
            if (that.getRemaining() > 0) {
                return that.tiles[index];
            } else {
                return -1;
            }
        }


    }

})(typeof global === 'undefined' ? window.scrabble : global.scrabble);