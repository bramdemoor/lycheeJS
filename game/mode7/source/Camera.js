
lychee.define('game.Camera').exports(function(lychee, global) {

	var Class = function(width, height, ratio) {

//		var fov = 100;
//		this.__depth    = 1 / Math.tan((fov/2) * Math.PI/180);
		this.__depth    = 0.2;
		this.__offset   = (width/height) * ratio * height;
		this.__ratio    = ratio;
		this.__position = { x: 0, y: 0, z: 0 };
		this.__rotation = 0;

		this.__distance = 0;
		this.__target   = null;

		this.__viewport = {
			width:  width,
			height: height
		};

	};


	Class.prototype = {

		reset: function(width, height) {

			var viewport = this.__viewport;

			viewport.width = width;
			viewport.height = height;


			this.__offset = (width/height) * this.__ratio * height;

		},

		update: function(clock, delta) {

			// TODO: The camera needs also an effect that it is
			// accelerating slower than the ship. Should look cool :)

			if (this.__target !== null) {

				var position = this.__target.getPosition();
				if (position.z > this.__distance) {
					this.__position.x = position.x;
					this.__position.y = this.__offset + position.y;
					this.__position.z = position.z - this.__distance;
				}

			}

		},

		follow: function(entity, distance) {

			if (
				entity != null
				&& typeof entity.getPosition === 'function'
				&& typeof distance === 'number'
			) {
				this.__target   = entity;
				this.__distance = distance;
			} else {
				this.__target = null;
			}

		},

		getDistance: function() {
			return this.__distance;
		},

		getOffset: function() {
			return this.__offset;
		},

		getPosition: function() {
			return this.__position;
		},

		setRotation: function(angle) {
			this.__rotation = angle;
		},

		getRotation: function() {
			return this.__rotation;
		},

		setRotation: function(rotation) {
			if (typeof rotation === 'number') {
				this.__rotation = rotation;
			}
		},

		getDepth: function() {
			return this.__depth;
		},

		getViewport: function() {
			return this.__viewport;
		}

	};


	return Class;

});

