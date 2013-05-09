
lychee.define('game.entity.Paddle').includes([
	'lychee.game.Entity'
]).exports(function(lychee, global, attachments) {

	var _images = {
		player: attachments['blue.png'],
		cpu:    attachments['red.png']
	};


	var Class = function(id) {

		var settings = {
			width:     24,
			height:    104,
			collision: lychee.game.Entity.COLLISION.A,
			shape:     lychee.game.Entity.SHAPE.rectangle
		};


		this.__image = _images[id] || null;


		lychee.game.Entity.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		render: function(renderer, offsetX, offsetY) {

			var position = this.getPosition();
			var hwidth   = this.width / 2;
			var hheight  = this.height / 2;
			var image    = this.getImage();


			renderer.drawSprite(
				position.x - hwidth,
				position.y - hheight,
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
