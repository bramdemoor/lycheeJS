
lychee.define('lychee.ui.Input').requires([
	'lychee.Font'
]).includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var _font = lychee.Font;


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__drag  = null;
		this.__font  = settings.font instanceof _font ? settings.font : null;
		this.__min   = typeof settings.min === 'number' ? settings.min : 0;
		this.__max   = typeof settings.max === 'number' ? settings.max : Infinity;

		this.__type  = Class.TYPE.text;
		this.__value = '';
		this.__rawvalue = '';


		this.setType(settings.type);
		this.setValue(settings.value);


		delete settings.font;
		delete settings.min;
		delete settings.max;
		delete settings.type;
		delete settings.value;


		settings.width  = typeof settings.width === 'number'  ? settings.width  : 64 * 4;
		settings.height = typeof settings.height === 'number' ? settings.height : 64;
		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;

		lychee.ui.Entity.call(this, 'ui-input', settings);


		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function() {}, this);

		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {
			this.setState('default');
		}, this);


		this.bind('key', function(key, name, delta) {

			var type = this.__type;
			var character = null;
			if (key.length === 1) {
				character = key;
			} else {

				if (key === 'backspace') {

					var value = this.__rawvalue;
					value = value.substr(0, value.length - 1);

					if (type === Class.TYPE.number) {

						if (value === '') {

							this.__value    = this.__default;
							this.__rawvalue = '';

						} else {

							value = parseInt(value, 10);
							if (!isNaN(value)) {
								this.setValue(value);
							}

						}

					} else {
						this.setValue(value);
					}


					return;

				} else if (key === 'space') {

					character = ' ';

				}

			}


			if (character !== null) {

				if (
					type === Class.TYPE.text
					&& character.match(/([A-Za-z0-9\s-_]+)/)
				) {

					this.setValue(this.__value + character);

				} else if (
					type === Class.TYPE.number
					&& character.match(/[0-9-+]/)
				) {

					var value = parseInt(this.__rawvalue + '' + character, 10);
					console.log(value);
					if (!isNaN(value)) {
						this.setValue(value);
					}

				}

			}

		}, this);


		settings = null;

	};



	Class.TYPE = {
		text:   0,
		number: 1
	};



	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		getDrag: function() {
			return this.__drag;
		},

		getFont: function() {
			return this.__font;
		},

		getOffset: function() {
			return 0;
		},

		getText: function(line) {
			return this.getValue() + '';
		},

		getType: function() {
			return this.__type;
		},

		setType: function(type) {

			if (typeof type !== 'number') return false;


			var found = false;

			for (var id in Class.TYPE) {

				if (type === Class.TYPE[id]) {
					found = true;
					break;
				}

			}


			if (found === true) {
				this.__type = type;
			}


			return found;

		},

		getValue: function() {

			if (
				this.__rawvalue === ''
				&& this.__type === Class.TYPE.number
			) {
				return 0;
			}


			return this.__value;

		},

		setValue: function(value) {

			var type = this.__type;


			// 0: Text
			if (
				type === Class.TYPE.text
				&& typeof value === 'string'
			) {

				if (
					value.length >= this.__min
					&& value.length <= this.__max
				) {

					this.__rawvalue = value + '';
					this.__value = value;
					return true;

				}

			// 1. Number
			} else if (
				type === Class.TYPE.number
				&& typeof value === 'number'
				&& !isNaN(value)
			) {

				if (
					value >= this.__min
					&& value <= this.__max
				) {

					this.__rawvalue = value + '';
					this.__value = value;
					return true;

				}

			}


			return false;

		}

	};


	return Class;

});

