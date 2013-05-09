
lychee.define('lychee.ui.Textarea').requires([
	'lychee.Font'
]).includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var _font = lychee.Font;


	var Class = function(data) {

		var settings = lychee.extend({}, data);

		this.__drag  = null;
		this.__font  = settings.font instanceof _font ? settings.font : null;
		this.__value = '';


		this.setValue(settings.value);


		delete settings.value;
		delete settings.font;


		settings.width  = typeof settings.width === 'number'  ? settings.width  : 64 * 4;
		settings.height = typeof settings.height === 'number' ? settings.height : 64;
		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;

		lychee.ui.Entity.call(this, 'ui-textarea', settings);


		/*
		 * INITIALIZATION
		 */

		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {
			this.setState('default');
		}, this);


		this.bind('key', function(key, name, delta) {

			var line      = this.__lines[this.__lines.length - 1];
			var character = key;

			if (key === 'return') {

				this.__lines.push('');

			} else {

				if (key === 'space') {
					character = ' ';
				} else if (key === 'tab') {
					character = '\t';
				}

				var ll = this.__lines.length;

				if (character.length === 1) {

					line += character;
					this.__lines[ll - 1] = line;

				} else if (key === 'backspace') {

					if (line.length > 0) {
						line = line.substr(0, line.length - 1);
						this.__lines[ll - 1] = line;
					} else if (ll > 1) {
						this.__lines.splice(ll - 1, 1);
					}

				}

			}

		}, this);


		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		render: function(renderer, offsetX, offsetY) {

			var position = this.getPosition();

			var x = position.x + offsetX;
			var y = position.y + offsetY;


			var hwidth  = this.width / 2;
			var hheight = this.height / 2;
			var bgcolor = this.getState() === 'active' ? '#666666' : '#333333';


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


			var font = this.__font;
			var ll = this.__lines.length;
			if (
				font !== null
				&& ll > 0
			) {

				renderer.flush(1);

				renderer.setBufferBoundaries(
					x - hwidth,
					y - hheight,
					x + hwidth,
					y + hheight
				);


				var lineHeight = font.getSettings().lineheight;
				for (var l = 0; l < ll; l++) {

					var text = this.__lines[l];

					renderer.drawText(
						x - hwidth,
						y - hheight + lineHeight * l,
						text,
						font,
						false
					);

				}


				renderer.flush(2);

			}

		},



		/*
		 * CUSTOM API
		 */

		getValue: function() {
			return this.__lines.join('\n');
		},

		setValue: function(value) {

			value = typeof value === 'string' ? value : null;

			if (value !== null) {

				this.__lines = value.split('\n');
				return true;

			}


			return false;

		}

	};


	return Class;

});

