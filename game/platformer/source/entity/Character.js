lychee.define('game.entity.Character')
    .includes(['lychee.game.Entity'])

    .exports(function(lychee, global) {

    var Class = function(image, font) {
        this.__image = image || null;

        this.__team = 0;
        this.__dir = 0;

        this.__font = font;

        lychee.game.Entity.call(this, {
            width:     64,
            height:    64,
            collision: lychee.game.Entity.COLLISION.A,
            shape:     lychee.game.Entity.SHAPE.rectangle
        });

        this.MAX_MOVEMENTSPEED = 150;

        // Animation
        this.__animationDuration = 0;
        this.__animationFrames   = 0;
        this.__animationFrame    = null;
        this.__animationLoop     = false;
        this.__animationClock    = null;

        this.spawn();
    };

    Class.prototype = {

        getFont: function() {
            return this.__font;
        },

        getPos: function() {
            return this.__position;
        },

        getDir: function() {
            return this.__dir;
        },

        spawn: function() {
            this.__position.x = 122;
            this.__position.y = 122;

            this.__canMoveLeft = true;
            this.__canMoveRight = true;

            this.__health  = 100;
        },

        jump: function() {
            console.log('jump');
        },

        moveLeft: function() {
            if(this.__canMoveLeft === true)
                this.__velocity.x = -this.MAX_MOVEMENTSPEED;

            this.__dir = -1;
        },

        moveRight: function() {
            if(this.__canMoveRight === true)
                this.__velocity.x = this.MAX_MOVEMENTSPEED;

            this.__dir = 1;
        },

        moveDown: function() {
            console.log('down');
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

            // Animation
            if (this.__animationClock !== null) {

                var t = (clock - this.__animationClock) / this.__animationDuration;

                if (t < 1) {
                    this.__animationFrame = Math.max(0, Math.ceil(t * this.__animationFrames) - 1);
                } else if (this.__animationLoop === true) {
                    this.__animationClock = clock;
                } else {
                    this.__clearAnimation();
                }

            }
        },

        /*
         * PRIVATE API
         */

        __clearAnimation: function() {
            if (this.__animationClock !== null) {
                this.__animationFrame = null;
                this.__animationClock = null;
            }
        },

        __setAnimation: function(duration, frames, loop) {
            this.__animationDuration = duration;
            this.__animationFrames   = frames;
            this.__animationFrame    = 0;
            this.__animationLoop     = loop;
            this.__animationClock    = this.__clock || 0;
        },

        getHealth: function() {
            return this.__health;
        },

        damage: function(health, active) {

            this.__health -= health;

            if (this.__health < 0) {
                this.__health = 0;
            }
        }
    };

    return Class;
});