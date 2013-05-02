
lychee.define('game.Player').requires([
	'game.entity.Ship'
]).exports(function(lychee, global) {

	var Class = function(id, type) {

		this.__id   = typeof id === 'string' ? id : 'local';
		this.__type = typeof type === 'number' ? type : 0;

		this.__ship = null;

	};


	Class.TYPE = {
		human: 0,
		com:   1
	};


	Class.prototype = {

		getId: function() {
			return this.__id;
		},

		getShip: function() {
			return this.__ship;
		},

		setShip: function(ship) {

			if (ship instanceof game.entity.Ship) {
				this.__ship = ship;
				this.__ship.reset();
			}

		}

	};


	return Class;

});

