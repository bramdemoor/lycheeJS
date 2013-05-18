lychee.define('game.scene.GameLevel').requires([
        'game.entity.Tile'
    ]).includes(['lychee.game.Graph']).exports(function(lychee, global) {
    var Class = function(game, settings) {
        this.game = game;

        this.__loop = game.loop;
        this.__renderer = game.renderer;

        this.__config   = game.config.tiles;
        this.__position = { x: 0, y: 0 };
        this.__offset   = { x: 0, y: 0 };
        this.__size     = { x: 5, y: 5 };

        this.__cache   = {};
        this.__grid    = [];

        this.__layers = { tileLayer: [] };
        this.__locked  = false;

        this.__width   = 0;
        this.__height  = 0;
        this.__tile    = 0;

        lychee.game.Graph.call(this);

        this.reset(settings);
    };

    Class.prototype = {

        reset: function(data) {
            lychee.game.Graph.prototype.reset.call(this);

            this.__width   = data.width;
            this.__height  = data.height;
            this.__tile    = data.tile;

            this.__size.x = (this.__width / this.__tile) | 0;
            this.__size.y = (this.__height / this.__tile) | 0;

            this.__position.x = data.position.x;
            this.__position.y = data.position.y;

            for (var x = 0; x < this.__size.x; x++) {

                if (this.__grid[x] === undefined) this.__grid[x] = [];

                for (var y = 0; y < this.__size.y; y++) {
                    if (this.__grid[x][y] === undefined) this.__grid[x][y] = null;
                }
            }

            this.__layers.tileLayer = [];

            var tile   = this.__tile;
            var image  = this.game.config.tiles.image;
            var states = this.game.config.tiles.states;
            var map    = this.game.config.tiles.map;

            var state = 'default';

            for (var x = 0; x < this.__size.x; x++) {

                for (var y = 0; y < this.__size.y; y++) {

                    var entity = new game.entity.Tile({
                        position: { x: x * tile, y: y * tile }, image: image, states: states, state: state, map: map
                    });

                    this.__layers.tileLayer.push(entity);
                }

            }
        },

        enter: function() {

        },

        leave: function() {

        },

        render: function(clock, delta) {
            if (this.__renderer !== null) {
                for (var b = 0, bl = this.__layers.tileLayer.length; b < bl; b++) {
                    this.__renderer.renderTile(this.__layers.tileLayer[b]);
                }

                this.__renderNode(this.__tree, this.__offset.x, this.__offset.y);
            }
        },

        /*
         * PRIVATE API
         */

        __renderNode: function(node, offsetX, offsetY) {
            if (node.entity !== null) {

                this.__renderer.renderTile(node.entity);

                offsetX += node.entity.getPosition().x;
                offsetY += node.entity.getPosition().y;
            }

            for (var c = 0, l = node.children.length; c < l; c++) {
                this.__renderNode(node.children[c], offsetX, offsetY);
            }
        }
    };

    return Class;
});

