lychee.define('game.entity.Character')
    .requires(['lychee.Font'])
    .includes(['lychee.game.Entity'])

    .exports(function(lychee, global) {

    var Class = function(image) {

        console.log('creating character');

        var settings = {
            width:     32,
            height:    32,
            collision: lychee.game.Entity.COLLISION.A,
            shape:     lychee.game.Entity.SHAPE.rectangle
        };

        this.__image = image || null;

        lychee.game.Entity.call(this, settings);

        settings = null;
    };

    Class.prototype = {
        getImage: function() {
            return this.__image;
        }
    };
});