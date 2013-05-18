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

        this.__position.x = 122;
        this.__position.y = 122;
    };

    Class.prototype = {
        spawn: function() {

        },

        jump: function() {
            console.log('jump');
        },

        moveLeft: function() {
            this.__velocity.x = -50;
        },

        moveRight: function() {
            this.__velocity.x = 50;
        },

        moveDown: function() {
            console.log('down');
        },

        action: function() {
            console.log('action');
        },

        getImage: function() {
            return this.__image;
        },

        updateCustom: function() {
            if(this.__velocity.x > 2) {
                this.__velocity.x -= 2;
            } else if(this.__velocity.x < -2) {
                this.__velocity.x += 2;
            } else {
                this.__velocity.x = 0;
            }
        }
    };

    return Class;
});