
lychee.define('game.entity.Ship').exports(function(lychee, global) {

	var Class = function(raw) {

		var data = lychee.extend({}, raw);


		this.__id          = typeof data.id === 'string' ? data.id : 'secret-ship';
		this.__title       = typeof data.title === 'string' ? data.title : 'Secret Ship';
		this.__description = typeof data.description === 'string' ? data.description : 'No Description';


		this.__acceleration = Math.min(data.acceleration, 100) || 0;
		this.__agility      = Math.min(data.agility, 100)      || 0;
		this.__deceleration = Math.min(data.deceleration, 100) || 0;
		this.__response     = Math.min(data.response, 100)     || 0;

		if (typeof data.speed === 'number') {
			this.__maxspeed = data.speed * 200;
		} else {
			this.__maxspeed = 0;
		}

		this.__speed = 0;
		this.__rotation = 0;

		this.__position = {
			x: 0, y: 0, z: 0, w: 0
		};


		this.__clock = {
			main:       null,
			accelerate: null,
			decelerate: null
		};


		this.__map = {
			rotation: {},
			speed: {}
		};



		if (data.spritemap) {
			this.__deserialize(data.spritemap);
		}


		this.reset();


		// cache settings for clone() method
		this._data = data;

	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__deserialize: function(spritemap) {

			// TODO: Make this somehow generic
			// without attaching the image here. -_-

			var rows    = 2048 / 64;
			var columns = 128 / 64;


			for (var state in spritemap) {

				var frames = [];

				var from = spritemap[state][0];
				var to   = spritemap[state][1];

				if (from === to) {

					frames.push({
						x: (from % rows) * 64,
						y: ((from / rows) | 0) * 64,
						w: 64,
						h: 64
					});

				} else if (to > from) {

					for (var f = from; f <= to; f++) {

						frames.push({
							x: (f % rows) * 64,
							y: ((f / rows) | 0) * 64,
							w: 64,
							h: 64
						});

					}

				} else if (from > to) {

					for (var f = from; f >= to; f--) {

						frames.push({
							x: (f % rows) * 64,
							y: ((f / rows) | 0) * 64,
							w: 64,
							h: 64
						});

					}

				}


				this.__map[state] = frames;

			}

		},



		/*
		 * PUBLIC API
		 */

		reset: function() {

			this.__position.x = 0;
			this.__position.y = 0;
			this.__position.z = 0;
			this.__position.w = 0;

			this.__speed = 0;

		},

		update: function(clock, delta) {

			var f = delta / 1000;
			var response = this.__response;

			var accelerate = this.__clock.accelerate;
			var decelerate = this.__clock.decelerate;

			if (accelerate !== null && clock < accelerate + response) {

				this.__speed += f * this.__acceleration * 100;

			} else if (decelerate !== null && clock < decelerate + response) {

				this.__speed -= f * this.__deceleration * 100;

			} else if (this.__speed !== 0) {

				if (this.__speed > 0) {
					this.__speed -= f * 25 * 100;
					this.__speed = Math.max(0, this.__speed);
				} else {
					this.__speed += f * 25 * 100;
				}

				this.__clock.accelerate = null;
				this.__clock.decelerate = null;

			}

			if (this.__speed > this.__maxspeed) {
				this.__speed = this.__maxspeed;
			}


			this.__position.z += f * this.__speed;

			this.__clock.main = clock;

		},

		clone: function() {

			return new game.entity.Ship(this._data);

		},

		accelerate: function() {
			this.__clock.accelerate = this.__clock.main;
		},

		decelerate: function() {
			this.__clock.decelerate = this.__clock.main;
		},

		stop: function() {
			this.__clock.decelerate = null;
			this.__clock.accelerate = null;
			this.__speed = 0;
		},

		steerLeft: function() {
			// TODO: Implement this
		},

		steerRight: function() {
			// TODO: Implement this
		},

		getSpeed: function() {
			return this.__speed;
		},

		getPosition: function() {
			return this.__position;
		},

		setPosition: function(x, y, z) {

			if (x !== null) {
				this.__position.x = x;
			}

			if (y !== null) {
				this.__position.y = y;
			}

			if (z !== null) {
				this.__position.z = z;
			}

		},

		getRotation: function() {
			return this.__rotation;
		},

		setRotation: function(degree) {

			var index = (((degree + 360) % 360) / 360 * 32) | 0;
			this.__rotation = index;

		},

		getMap: function() {

			var rotation = this.__rotation;

			if (this.__speed >= this.__maxspeed * 0.5) {

				return this.__map.rotation[rotation];

			} else if (this.__speed > 0) {

				var index = ((this.__speed / this.__maxspeed) * 16) | 0;
				return this.__map.speed[index];

			} else {
				return this.__map.speed[0];
			}

		}

	};


	return Class;

});

