lychee.define('game.entity.Powerup')
    .includes(['lychee.game.Entity'])

    .exports(function(lychee, global) {

        var Class = function(image) {
            this.__image = image || null;

            lychee.game.Entity.call(this, {
                width:     16,
                height:    16,
                collision: lychee.game.Entity.COLLISION.A,
                shape:     lychee.game.Entity.SHAPE.rectangle
            });

            this.spawn();
        };

        Class.prototype = {

            getPos: function() {
                return this.__position;
            },

            getDir: function() {
                return 1;
            },

            spawn: function() {
                this.__position.x = 322;
                this.__position.y = 122;
            },

            getImage: function() {
                return this.__image;
            }
        };

        return Class;
    });