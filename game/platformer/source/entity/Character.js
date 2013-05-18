lychee.define('game.entity.Character')
    .includes(['lychee.game.Entity'])

    .exports(function(lychee, global) {

    var Class = function(image) {
        this.__image = image || null;

        lychee.game.Entity.call(this, {
            width:     32,
            height:    32,
            collision: lychee.game.Entity.COLLISION.A,
            shape:     lychee.game.Entity.SHAPE.rectangle
        });

        this.MAX_MOVEMENTSPEED = 150;

        this.__position.x = 122;
        this.__position.y = 122;

        this.__canMoveLeft = true;
        this.__canMoveRight = true;
    };

    Class.prototype = {
        getPos: function() {
            return this.__position;
        },

        spawn: function() {

        },

        jump: function() {
            console.log('jump');
        },

        moveLeft: function() {
            if(this.__canMoveLeft === true)
                this.__velocity.x = -this.MAX_MOVEMENTSPEED;
        },

        moveRight: function() {
            if(this.__canMoveRight === true)
                this.__velocity.x = this.MAX_MOVEMENTSPEED;
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

        updateCustom: function(canMoveLeft, canMoveRight) {
            this.__canMoveLeft = canMoveLeft;
            this.__canMoveRight = canMoveRight;

            if(this.__velocity.x < 0) {
                if(canMoveLeft === false) {
                    this.__velocity.x = 0;
                }
            }

            if(this.__velocity.x > 0) {
                if(canMoveRight === false) {
                    this.__velocity.x = 0;
                }
            }

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