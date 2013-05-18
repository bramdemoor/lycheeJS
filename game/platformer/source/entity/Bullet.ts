/// <reference path="../def/lychee.d.ts"/>

class Bullet {

    constructor(image: any = null) {
        (<any>this).__image = image;

        lychee.game.Entity.call(this, {
            width:     32,
            height:    32,
            collision: lychee.game.Entity.COLLISION.A,
            shape:     lychee.game.Entity.SHAPE.rectangle
        });

        (<any>this).__position.x = 152;
        (<any>this).__position.y = 122;
    }

    getImage() {
        return (<any>this).__image;
    }

    getPos() {
        return (<any>this).__position;
    }
}

lychee.define('game.entity.Bullet')
    .includes(['lychee.game.Entity'])
    .exports((lychee, global) => { return Bullet; });