
lychee.define('game.ar.command.CONFIG').exports(function(lychee, global) {

	var Class = function(key, value) {

		this.key    = '';
		this.values = [ '' ];

		this.set(key, value);

	};

	Class.prototype = {

		set: function(key, values) {

			key = typeof key === 'string' ? key : this.key;


			if (value instanceof Array) {
				this.values = value;
			} else if (typeof value === 'string') {
				this.values = [ value ];
			}

		},

		toString: function(sequence) {

			if (typeof sequence !== 'number') {
				sequence = 1;
			}


			var key   = this.key;
			var value = '';

			for (var v = 0, vl = this.values.length; v < vl; v++) {

				value += this.values[v];

				if (v !== vl - 1) {
					value += ',';
				}

			}



			var str = 'AT*CONFIG=';

			str += sequence + ',';

			str += '"' + this.key + '",';
			str += '"' + value    + '"';

			str += '\r';


			return str;

		}

	};


	return Class;

});

