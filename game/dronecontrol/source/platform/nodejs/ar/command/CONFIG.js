
lychee.define('game.ar.command.CONFIG').exports(function(lychee, global) {

	var Class = function(key, value) {

		this.key   = '';
		this.value = '';

		this.set(key, value);

	};

	Class.prototype = {

		set: function(key, value) {
			this.key = typeof key === 'string' ? key : '';
			this.value = typeof value === 'string' ? value : '';
		},

		toString: function(sequence) {

			if (typeof sequence !== 'number') {
				sequence = 1;
			}


			var str = 'AT*CONFIG=';

			str += sequence + ',';
			str += '"' + this.key   + '",';
			str += '"' + this.value + '"';

			str += '\r';


			return str;

		}

	};


	return Class;

});

