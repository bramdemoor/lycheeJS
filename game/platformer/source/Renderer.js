
lychee.define('game.Renderer').includes([
	'lychee.ui.Renderer'
]).exports(function(lychee, global) {

	var Class = function(id) {

		lychee.ui.Renderer.call(this, id);

	};

	Class.prototype = {

		renderText: function(entity) {

			var pos = entity.getPosition();

			this.drawText(
				pos.x, pos.y,
				entity.getText(),
				entity.getFont(),
				true
			);

		}

	};


	return Class;

});

