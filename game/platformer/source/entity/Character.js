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

        var velocity = this.getVelocity();
        velocity.x = 50;
    };

    Class.prototype = {
        getImage: function() {
            return this.__image;
        },

        updateCustom: function() {
            var velocity = this.getVelocity();
            if(velocity.x > 1) {
                velocity.x -= 1;
            }
        }
    };

    return Class;
});