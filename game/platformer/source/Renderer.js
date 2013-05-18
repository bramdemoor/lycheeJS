lychee.define('game.Renderer').includes(['lychee.ui.Renderer']).exports(function(lychee, global) {

	var Class = function(id) {
		lychee.ui.Renderer.call(this, id);
	};

	Class.prototype = {
        renderEntity: function(entity) {
            var dx = entity.radius || entity.width / 2;
            var dy = entity.radius || entity.height / 2;

            var pos = entity.getPos();
            var image = entity.getImage();

            this.drawSprite(pos.x - dx, pos.y - dy, image);
        },

        renderTile: function(entity) {
            var map = entity.getMap();
            var pos = entity.getPosition();
            var image = entity.getImage();

            this.drawSprite(pos.x - entity.width / 2, pos.y - entity.height / 2, image, map);
        }
	};

	return Class;
});