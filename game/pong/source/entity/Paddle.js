
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

		getImage: function() {
			return this.__image;
		}

	};


	return Class;

});
