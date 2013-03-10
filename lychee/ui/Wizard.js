
lychee.define('lychee.ui.Wizard').requires([
	'lychee.Font',
	'lychee.ui.Area',
	'lychee.ui.Button'
]).includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var _area   = lychee.ui.Area;
	var _button = lychee.ui.Button;
	var _font   = lychee.Font;


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__font   = null;
		this.__labels = {
			next: 'Next',
			prev: 'Back'
		};
		this.__locked = false;
		this.__index  = null;
		this.__areas  = [];


		if (settings.labels instanceof Object) {

			if (typeof settings.labels.next === 'string') {
				this.__labels.next = settings.labels.next;
			}

			if (typeof settings.labels.prev === 'string') {
				this.__labels.prev = settings.labels.prev;
			}

		}

		if (settings.font instanceof _font) {
			this.__font = settings.font;
		}

		if (settings.areas instanceof Array) {

			for (var a = 0, al = settings.areas.length; a < al; a++) {

				var area = settings.areas[a];
				if (area instanceof _area) {
					this.__areas.push(area);
				}

			}

		}


		lychee.ui.Entity.call(this, 'ui-wizard', settings);

		settings = null;


		this.__deserialize();

		this.reset();

	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__onNext: function() {
			this.next();
		},

		__onPrev: function() {
			this.prev();
		},

		__deserialize: function() {

			for (var a = 0, al = this.__areas.length; a < al; a++) {

				var area = this.__areas[a];
				var hwidth  = area.width / 2;
				var hheight = area.height / 2;

				var next = new _button({
					label: this.__labels.next,
					font:  this.__font
				});

				next.setPosition({
					x: hwidth - next.width / 2,
					y: hheight - next.height / 2
				});

				next.bind('touch', this.__onNext, this);

				area.add(next);


				var prev = new _button({
					label: this.__labels.prev,
					font:  this.__font
				});

				prev.setPosition({
					x: (-1 * hwidth) + prev.width / 2,
					y: hheight - prev.height / 2
				});

				prev.bind('touch', this.__onPrev, this);

				area.add(prev);

			}

		},



		/*
		 * PUBLIC API
		 */

		reset: function() {
			this.__index = 0;
		},

		next: function() {

			this.__index++;

			if (this.__index === this.__areas.length) {

				this.__index = this.__areas.length - 1;

			} else {

				var area = this.__areas[this.__index];
				this.trigger('update', [ this.__index, area ]);

			}

		},

		prev: function() {

			this.__index--;

			if (this.__index < 0) {

				this.__index = 0;

			} else {

				var area = this.__areas[this.__index];
				this.trigger('update', [ this.__index, area ]);

			}

		},

		getArea: function() {

			var area = this.__areas[this.__index];
			if (area !== undefined) {
				return area;
			}


			return null;

		}

	};


	return Class;

});

