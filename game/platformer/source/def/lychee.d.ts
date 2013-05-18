module LycheeJS.Game {
    export class CollisionGroup {
        none: number;
        A: number;
        B: number;
        C: number;
        D: number;
    }

    export class ShapeType {
        circle: number;
        sphere: number;
        rectangle: number;
        cuboid: number;
        polygon: number;
    }

    export class Entity {
        static SHAPE: ShapeType;
        static COLLISION: CollisionGroup;

        static call(entity: any, options: any) : any;
    }
}

var lychee: any;