 lychee.define('game.entity.Tile').includes(['lychee.game.Sprite']).exports(function(lychee, global) {
    var Class = function(settings) {
        lychee.game.Sprite.call(this, settings);
    };

    Class.prototype = {
    };

    return Class;
});

