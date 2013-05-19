var Bullet = (function () {
    function Bullet(image, startX, startY, dir) {
        if (typeof image === "undefined") { image = null; }
        if (typeof startX === "undefined") { startX = 0; }
        if (typeof startY === "undefined") { startY = 0; }
        if (typeof dir === "undefined") { dir = 1; }
        var a = this;
        a.__image = image;
        (this).__dir = dir;
        lychee.game.Entity.call(this, {
            width: 32,
            height: 32,
            collision: lychee.game.Entity.COLLISION.A,
            shape: lychee.game.Entity.SHAPE.rectangle
        });
        (this).__position.x = startX;
        (this).__position.y = startY;
        (this).__velocity.x = 100 * dir;
    }
    Bullet.prototype.getImage = function () {
        return (this).__image;
    };
    Bullet.prototype.getPos = function () {
        return (this).__position;
    };
    Bullet.prototype.getDir = function () {
        return (this).__dir;
    };
    return Bullet;
})();
lychee.define('game.entity.Bullet').includes([
    'lychee.game.Entity'
]).exports(function (lychee, global) {
    return Bullet;
});
//@ sourceMappingURL=Bullet.js.map
