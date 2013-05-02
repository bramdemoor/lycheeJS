
lychee.define('game.Track').requires([
	'game.entity.Background'
]).exports(function(lychee, global) {

	var Class = function(data, world) {

		this.__world = world;


		if (data.type === 'circuit') {

			this.__type   = 'circuit';
			this.__rounds = typeof data.rounds === 'number' ? data.rounds : 1;

		} else if (data.type === 'sprint') {

			this.__type   = 'sprint';
			this.__rounds = 1;

		} else {

			this.__type   = 'stadium';
			this.__rounds = Infinity;

		}


		this.__id          = typeof data.id === 'string' ? data.id : 'secret-track';
		this.__title       = typeof data.title === 'string' ? data.title: 'Secret Track';
		this.__length      = 0;
		this.__loop        = false;
		this.__palette     = [];
		this.__rotation    = 0;
		this.__segments    = [];


		this.__deserialize(data);

	};


	Class.ELEMENTS = {

		jump: function(t, from, to) {
			return from + (to - from) * Math.pow(t ,2);
		},

		hill: function(t, from, to) {
			return from + (to - from) * ((-Math.cos(t * Math.PI)/2) + 0.5);
		}

	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */


		__addRouteSegments: function(length, curve, element, fromY, toY) {

			fromY = fromY || 0;
			toY = toY || 0;

			var c = 0;
			if (curve !== 0) {
				c = ((curve / 90) * 100 / length) | 0;
			}


			var callback = null;
			if (element !== null) {
				callback = Class.ELEMENTS[element];
			}


			var curviness = 0;
			var tracklength = this.__length;

			var lastY = fromY;
			var currentY = 0;

			for (var s = 0; s < length; s++) {

				var rotation = this.__rotation + (curve / length);

				if (callback !== null) {
					currentY = callback.call(this, (s + 1) / length, fromY, toY) | 0;
				}


				this.__addRouteSegment(curviness, rotation, lastY, currentY);

				curviness += c;
				tracklength += 200;
				lastY = currentY;

				this.__rotation = rotation;

			}


			this.__length = tracklength;

		},

		__addRouteSegment: function(curviness, rotation, lastY, currentY) {

			var index = this.__segments.length;
			var paletteIndex = ((index / 3) | 0) % this.__palette.length;


			this.__segments.push({
				index:     index,
				rotation:  rotation,
				curviness: curviness,
				from: {
					y: lastY,
					z: index * 200
				},
				to: {
					y: currentY,
					z: (index + 1) * 200
				},
				palette: this.__palette[paletteIndex]
			});

		},

		__deserialize: function(data) {

			for (var p = 0, l = data.palette.length; p < l; p++) {

				var serialized = data.palette[p];

				if (Object.prototype.toString.call(serialized) === '[object Object]') {

					this.__palette.push({
						terrain: serialized.terrain || null,
						road:    serialized.road    || null,
						rumble:  serialized.rumble  || null,
						lane:    serialized.lane    || null
					});

				}

			}


			var lastoffset = 0;

			for (var r = 0, l = data.route.length; r < l; r++) {

				var road = data.route[r][0];
				var length  = data.route[r][1] || 1;
				var element = data.route[r][2] || null;
				var offset  = data.route[r][3] * 20 || 0;


				switch(road) {
					case "straight":
						this.__addRouteSegments(length,   0, element, lastoffset, offset);
						break;
					case "left-45":
						this.__addRouteSegments(length, -45, element, lastoffset, offset);
						break;
					case "left-90":
						this.__addRouteSegments(length, -90, element, lastoffset, offset);
						break;
					case "right-45":
						this.__addRouteSegments(length,  45, element, lastoffset, offset);
						break;
					case "right-90":
						this.__addRouteSegments(length,  90, element, lastoffset, offset);
						break;
					default:
						break;

				}

				lastoffset = offset;

			}

		},



		/*
		 * PUBLIC API
		 */

		getId: function() {
			return this.__id;
		},

		getLength: function(segments) {

			segments = segments === true;

			if (segments === true) {
				return this.__segments.length;
			} else {
				return this.__length;
			}

		},

		getSegments: function() {
			return this.__segments;
		},

		getWorld: function() {
			return this.__world;
		}

	};


	return Class;

});

