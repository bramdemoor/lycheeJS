
lychee.define('game.entity.ui.Layers').includes([
	'lychee.ui.Area'
]).exports(function(lychee, global) {

	var Class = function(data, state) {

		this.state = state;


		var settings = lychee.extend({}, data);


		lychee.ui.Area.call(this, settings);

		settings = null;

	};


	Class.prototype = {
	};


	return Class;

});

