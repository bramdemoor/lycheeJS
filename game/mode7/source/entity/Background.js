
lychee.define('game.entity.Background').exports(function(lychee, global) {

	var Class = function(raw) {

		var data = lychee.extend({}, raw);


		this.__id = typeof raw.id === 'string' ? raw.id : 'default';
		this.__map = {
			x: typeof data.x === 'number' ? data.x : 0,
			y: typeof data.y === 'number' ? data.y : 0,
			w: typeof data.w === 'number' ? data.w : 0,
			h: typeof data.h === 'number' ? data.h : 0
		};
		this.__position = { x: 0, y: 0, z: 0 };


		if (typeof data.z === 'number') {
			this.__position.z = data.z;
		}

		if (Object.prototype.toString.call(raw.position) === '[object Object]') {
			this.__position.x = raw.position.x;
			this.__position.y = raw.position.y;
		}


		data = null;

	};


	Class.prototype = {

		getId: function() {
			return this.__id;
		},

		getMap: function() {
			return this.__map;
		},

		getPosition: function() {
			return this.__position;
		}

	};


	return Class;

});

