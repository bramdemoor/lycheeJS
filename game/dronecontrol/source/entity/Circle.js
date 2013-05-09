
lychee.define('game.entity.Circle').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(settings) {

		settings.shape = lychee.ui.Entity.SHAPE.circle;

		lychee.ui.Entity.call(this, 'game-text', settings);


		//this.bind('swipe', function(id, type, position, delta, swipe) {
		//	console.log(type, position.x, position.y);
		//}, this);

	};


	Class.prototype = {

		render: function(renderer, offsetX, offsetY) {

			var position = this.getPosition();

			var radius = this.radius;


			renderer.drawCircle(
				position.x + offsetX,
				position.y + offsetY,
				radius,
				'#ff0000',
				true
			);

		}

	};


	return Class;

});

