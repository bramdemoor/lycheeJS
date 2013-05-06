
lychee.define('game.Renderer').requires([
	'game.entity.Ball',
	'game.entity.Paddle'
]).includes([
	'lychee.ui.Renderer'
]).exports(function(lychee, global) {

	var _ball   = game.entity.Ball;
	var _paddle = game.entity.Paddle;


	var Class = function(id) {

		lychee.ui.Renderer.call(this, id);

	};

	Class.prototype = {

		renderEntity: function(entity, offsetX, offsetY) {

			if (
				entity instanceof _ball
				|| entity instanceof _paddle
			) {

				this.renderPongEntity(entity, offsetX, offsetY);

			} else {

				lychee.ui.Renderer.prototype.renderEntity.call(this, entity, offsetX, offsetY);

			}

		},

		renderPongEntity: function(entity) {

			var dx = entity.radius || entity.width / 2;
			var dy = entity.radius || entity.height / 2;

			var pos = entity.getPosition();
			var image = entity.getImage();


			this.drawSprite(
				pos.x - dx,
				pos.y - dy,
				image
			);

		}

	};


	return Class;

});

