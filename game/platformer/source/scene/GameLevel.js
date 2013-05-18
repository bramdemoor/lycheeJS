lychee.define('game.scene.GameLevel').includes(['lychee.game.Graph']).exports(function(lychee, global) {
    var Class = function(game, settings) {
        this.game = game;

        this.__loop = game.loop;
        this.__renderer = game.renderer;

        this.__position = { x: 0, y: 0 };
        this.__offset   = { x: 0, y: 0 };

        this.__cache   = {};
        this.__grid    = [];

        this.__layers = { background: [] };
        this.__locked  = false;

        lychee.game.Graph.call(this);

        this.reset(settings);
    };

    Class.prototype = {

        reset: function(data) {
            lychee.game.Graph.prototype.reset.call(this);
        },

        enter: function() { },

        leave: function() {},

        render: function(clock, delta) {
            if (this.__renderer !== null) {
                // do stuff
            }
        }

    };

    return Class;
});

