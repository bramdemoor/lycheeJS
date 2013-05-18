
lychee.define('game.Renderer').includes([
	'lychee.Renderer'
]).exports(function(lychee, global) {

	var Class = function(id) {

		lychee.Renderer.call(this, id);

	};

	Class.prototype = {

		renderText: function(entity, offsetX, offsetY) {

			offsetX = offsetX || 0;
			offsetY = offsetY || 0;


			var pos = entity.getPosition();

			var realX = pos.x + offsetX;
			var realY = pos.y + offsetY;


			this.drawText(
				realX, realY,
				entity.text,
				entity.font,
				true
			);

		}

	};


	return Class;

});

