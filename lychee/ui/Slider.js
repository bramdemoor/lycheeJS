
lychee.define('lychee.ui.Slider').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__drag      = { x: 0, y: 0 };
		this.__precision = 2; // defaulted precision
		this.__range     = { from: 0, to: 1, delta: 0.001 };
		this.__value     = 0;


		if (settings.range !== undefined) {
			this.setRange(settings.range);
		}

		if (settings.precision !== undefined) {
			this.setPrecision(settings.precision);
		}


		if (typeof settings.shape !== 'number') {
			settings.shape = Class.SHAPE.rectangle;
		}


		if (settings.shape === Class.SHAPE.circle) {
			settings.radius = typeof settings.radius === 'number' ? settings.radius : 64;
		} else if (settings.shape === Class.SHAPE.rectangle) {
			settings.width  = typeof settings.width === 'number'  ? settings.width  : 64 * 2;
			settings.height = typeof settings.height === 'number' ? settings.height : 64;
		}


		delete settings.range;

		lychee.ui.Entity.call(this, 'ui-slider', settings);


		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function(id, position, delta) {
			this.__refreshValue(position.x, position.y);
		}, this);

		if (settings.value !== undefined) {
			this.setValue(settings.value);
		} else {
			this.setValue(this.__range.from);
		}


		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {
			this.setState('default');
		}, this);


		this.bind('swipe', function(id, type, position, delta, swipe) {
			this.__refreshValue(position.x, position.y);
		}, this);


		settings = null;

	};


	// Same ENUM values as lychee.game.Entity
	Class.SHAPE = {
		circle:    0,
		rectangle: 2
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		render: function(renderer, offsetX, offsetY) {

			var position = this.getPosition();

			var x = position.x + offsetX;
			var y = position.y + offsetY;

			var bgcolor = this.getState() === 'active' ? '#666666' : '#333333';


			var drag = this.__drag;
			var shape = this.getShape();
			if (shape === Class.SHAPE.circle) {

				var radius = this.radius;

				renderer.setAlpha(0.5);

				renderer.drawCircle(
					x,
					y,
					radius,
					bgcolor,
					true
				);

				renderer.setAlpha(1.0);

				renderer.drawCircle(
					x + drag.x,
					y + drag.y,
					24,
					'#ff0000',
					true
				);

			} else if (shape === Class.SHAPE.rectangle) {

				var hwidth  = this.width / 2;
				var hheight = this.height / 2;


				renderer.setAlpha(0.5);

				renderer.drawBox(
					x - hwidth,
					y - hheight,
					x + hwidth,
					y + hheight,
					bgcolor,
					true
				);

				renderer.setAlpha(1.0);

				renderer.drawCircle(
					x + drag.x,
					y + drag.y,
					24,
					'#ff0000',
					true
				);

			}

		},



		/*
		 * CUSTOM API
		 */

		__refreshValue: function(x, y) {

			var shape = this.getShape();

			if (shape === Class.SHAPE.circle) {

			} else if (shape === Class.SHAPE.rectangle) {

				var width   = this.width;
				var height  = this.height;
				var index   = 0;

				if (width > height) {
					index = Math.max(0.0, Math.min(1.0, 1 - (x + width / 2) / width));
				} else {
					index = Math.max(0.0, Math.min(1.0, 1 - (y + height / 2) / height));
				}


				var range = this.__range;
				var value = index * (range.to - range.from);

				if (range.from < 0) {
					value += range.from;
				}

				value = ((value / range.delta) | 0) * range.delta;

				this.setValue(value);

			}

		},

		getPrecision: function() {
			return this.__precision;
		},

		setPrecision: function(precision) {

			if (typeof precision === 'number') {
				this.__precision = precision;
				return true;
			}


			return false;

		},

		getRange: function() {
			return this.__range;
		},

		setRange: function(range) {

			if (range instanceof Object) {

				this.__range.from  = typeof range.from === 'number'  ? range.from  : this.__range.from;
				this.__range.to    = typeof range.to === 'number'    ? range.to    : this.__range.to;
				this.__range.delta = typeof range.delta === 'number' ? range.delta : this.__range.delta;

				return true;

			}


			return true;

		},

		getValue: function() {
			return this.__value;
		},

		setValue: function(value) {

			value = typeof value === 'number' ? value : null;

			if (
				value !== null
				&& this.__value !== value
			) {

				var range = this.__range;
				var index = (range.from + value) / (range.to - range.from) - range.from;

//				if (value > range.to) {
//					value %= range.to;
//				}


				var shape = this.getShape();
				if (shape === Class.SHAPE.circle) {

					var radius = this.radius;

					this.__drag.x = Math.sin(index * 2 * Math.PI) * (radius - 24);
					this.__drag.y = Math.cos(index * 2 * Math.PI) * (radius - 24);

				} else if (shape === Class.SHAPE.rectangle) {

					var width  = this.width;
					var height = this.height;

					if (width > height) {
						this.__drag.x = width * index - (width / 2);
						this.__drag.y = 0;
					} else {
						this.__drag.x = 0;
						this.__drag.y = height * (1 - index) - (height / 2);
					}

				}


				this.trigger('change', [ value ]);

				this.__value = value;

				return true;

			}


			return false;

		}

	};


	return Class;

});

