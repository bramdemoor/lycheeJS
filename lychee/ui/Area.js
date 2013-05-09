
lychee.define('lychee.ui.Area').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__entities   = [];
		this.__scrollable = settings.scrollable === true;

		this.__scroll = {
			active:   false,
			start:    null,
			duration: 0,
			from:     { x: 0, y: 0 },
			to:       { x: 0, y: 0 }
		};


		delete settings.scrollable;


		lychee.ui.Entity.call(this, 'ui-area', settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		sync: function(clock, force) {

			force = force === true;

			if (force === true) {
				this.__clock = clock;
			}


			if (this.__clock === null) {

				if (this.__scroll.active === true && this.__scroll.start === null) {
					this.__scroll.start = this.__clock;
				}

				this.__clock = clock;

			}

		},

		update: function(clock, delta) {


			// 1. Sync clocks initially
			// (if Entity was created before loop started)
			if (this.__clock === null) {
				this.sync(clock);
			}


			var t  = 0;
			var dt = delta / 1000;


			// 2. Scrolling
			if (this.__scroll.active === true && this.__scroll.start !== null) {

				t = (this.__clock - this.__scroll.start) / this.__scroll.duration;

				if (t <= 1) {

					var from = this.__scroll.from;
					var to   = this.__scroll.to;

					this.__position.x = from.x + t * (to.x - from.x);
					this.__position.y = from.y + t * (to.y - from.y);

				} else {

					this.setPosition(this.__scroll.to);
					this.__scroll.active = false;

				}

			}


			// 3. Entities
			for (var e = 0, el = this.__entities.length; e < el; e++) {
				this.__entities[e].update(clock, delta);
			}


			this.__clock = clock;

		},

		render: function(renderer, offsetX, offsetY) {

			var position = this.getPosition();

			var x = position.x + offsetX;
			var y = position.y + offsetY;


			if (lychee.debug === true) {

				var hwidth  = this.width / 2;
				var hheight = this.height / 2;

				renderer.drawBox(
					x - hwidth,
					y - hheight,
					x + hwidth,
					y + hheight,
					'#ff00ff',
					false,
					1
				);

			}


			var entities = this.getEntities();
			for (var e = 0, el = entities.length; e < el; e++) {

				renderer.renderEntity(
					entities[e],
					x,
					y
				);

			}

		},



		/*
		 * CUSTOM API
		 */

		getEntities: function() {
			return this.__entities;
		},

		addEntity: function(entity) {

			var found = false;

			for (var e = 0, el = this.__entities.length; e < el; e++) {

				if (this.__entities[e] === entity) {
					found = true;
					break;
				}

			}


			if (found === false) {
				this.__entities.push(entity);
			}


			return found === false;

		},

		removeEntity: function(entity) {

			var found = false;

			for (var e = 0, el = this.__entities.length; e < el; e++) {

				if (this.__entities[e] === entity) {
					this.__entities.splice(e, 1);
					found = true;
					el--;
				}

			}


			return found;

		},

		scrollBy: function(duration, offset) {

			duration = typeof duration === 'number' ? duration : 500;


			if (offset instanceof Object) {

				offset.x = typeof offset.x === 'number' ? offset.x : 0;
				offset.y = typeof offset.y === 'number' ? offset.y : 0;


				var pos    = this.getPosition();
				var scroll = this.__scroll;

				scroll.start    = this.__clock;
				scroll.active   = true;
				scroll.duration = duration;
				scroll.from.x   = pos.x;
				scroll.from.y   = pos.y;
				scroll.to.x     = pos.x + offset.x;
				scroll.to.y     = pos.y + offset.y;

				return true;

			}


			return false;

		}

	};


	return Class;

});

