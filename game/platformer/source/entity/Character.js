lychee.define('game.entity.Character')
    .includes(['lychee.game.Entity'])

    .exports(function(lychee, global) {

    var Class = function(image) {
        var settings = {
            width:     32,
            height:    32,
            collision: lychee.game.Entity.COLLISION.A,
            shape:     lychee.game.Entity.SHAPE.rectangle
        };

        this.__image = image || null;

        lychee.game.Entity.call(this, settings);

        settings = null;

        this.__position.y = 122;
        this.__velocity.x = 50;
    };

    Class.prototype = {
        spawn: function() {

        },

        getImage: function() {
            return this.__image;
        },

        updateCustom: function() {
            if(this.__velocity.x > 1) {
                this.__velocity.x -= 1;
            }
        }
    };

    return Class;
});