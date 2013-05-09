
lychee.define('game.entity.Ball').includes([
	'lychee.game.Entity'
]).exports(function(lychee, global, attachments) {

	var _image = attachments['png'];


	var Class = function() {

		var settings = {
			radius:    11,
			collision: lychee.game.Entity.COLLISION.A,
			shape:     lychee.game.Entity.SHAPE.circle
		};


		this.__image = _image;


		lychee.game.Entity.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		render: function(renderer, offsetX, offsetY) {

			var position = this.getPosition();
			var radius   = this.radius;
			var image    = this.getImage();


			renderer.drawSprite(
				position.x - radius,
				position.y - radius,
				image
			);

		},



		/*
		 * CUSTOM API
		 */

		getImage: function() {
			return this.__image;
		}

	};


	return Class;

});
