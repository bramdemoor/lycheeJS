/// <reference path="../def/lychee.d.ts"/>

class Bullet {

    constructor(image: any = null, startX: number = 0, startY: number = 0, dir: number = 1) {
        var a: any = this;
        a.__image = image;

        (<any>this).__dir = dir;

        lychee.game.Entity.call(this, {
            width:     32,
            height:    32,
            collision: lychee.game.Entity.COLLISION.A,
            shape:     lychee.game.Entity.SHAPE.rectangle
        });

        (<any>this).__position.x = startX;
        (<any>this).__position.y = startY;

        (<any>this).__velocity.x = 100 * dir;
    }

    getImage() {
        return (<any>this).__image;
    }

    getPos() {
        return (<any>this).__position;
    }

    getDir() {
        return (<any>this).__dir;
    }
}

lychee.define('game.entity.Bullet')
    .includes(['lychee.game.Entity'])
    .exports((lychee, global) => { return Bullet; });