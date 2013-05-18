var Bullet = (function () {
    function Bullet(image) {
        if (typeof image === "undefined") { image = null; }
        (this).__image = image;
        lychee.game.Entity.call(this, {
            width: 32,
            height: 32,
            collision: lychee.game.Entity.COLLISION.A,
            shape: lychee.game.Entity.SHAPE.rectangle
        });
        (this).__position.x = 152;
        (this).__position.y = 122;
    }
    Bullet.prototype.getImage = function () {
        return (this).__image;
    };
    Bullet.prototype.getPos = function () {
        return (this).__position;
    };
    return Bullet;
})();
lychee.define('game.entity.Bullet').includes([
    'lychee.game.Entity'
]).exports(function (lychee, global) {
    return Bullet;
});
//@ sourceMappingURL=Bullet.js.map
