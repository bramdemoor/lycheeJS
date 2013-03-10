
lychee.define('lychee.ui.Area').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__children   = [];
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
		 * PRIVATE API
		 */

		__getChildByPosition: function(position) {

			var found = null;

			for (var c = 0, cl = this.__children.length; c < cl; c++) {

				var child    = this.__children[c];
				var cpos     = child.getPosition();
				var chwidth  = child.width / 2;
				var chheight = child.height / 2;


				var x1 = cpos.x - chwidth;
				var y1 = cpos.y - chheight;
				var x2 = cpos.x + chwidth;
				var y2 = cpos.y + chheight;


				if (
					position.x >= x1 && position.x <= x2
					&& position.y >= y1 && position.y <= y2
				) {
					found = child;
					break;
				}

			}


			return found;

		},



		/*
		 * PUBLIC API
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


			// 3. Children
			for (var c = 0, cl = this.__children.length; c < cl; c++) {
				this.__children[c].update(clock, delta);
			}


			this.__clock = clock;

		},

		getChildren: function() {
			return this.__children;
		},

		add: function(entity) {

			var found = false;

			for (var c = 0, cl = this.__children.length; c < cl; c++) {

				if (this.__children[c] === entity) {
					found = true;
					break;
				}

			}


			if (found === false) {
				this.__children.push(entity);
			}


			return found === false;

		},

		remove: function(entity) {

			var found = false;

			for (var c = 0, cl = this.__children.length; c < cl; c++) {

				if (this.__children[c] === entity) {
					found = true;
					this.__children.splice(c, 1);
					cl--;
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

		},

		triggerChildren: function(name, position) {

			var offset = this.getPosition();

			position.x -= offset.x;
			position.y -= offset.y;


			var entity = this.__getChildByPosition(position);
			if (entity !== null) {

				if (typeof entity.triggerChildren === 'function') {

					entity.triggerChildren(name, position);
					return true;

				} else if (typeof entity.trigger === 'function') {

					entity.trigger(name, [ entity ]);
					return true;

				}

			}


			return false;

		}

	};


	return Class;

});

