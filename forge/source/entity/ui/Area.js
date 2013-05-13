
lychee.define('game.entity.ui.Area').includes([
	'lychee.ui.Area'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		lychee.ui.Area.call(this, settings);

		settings = null;

	};


	Class.prototype = {
	};


	return Class;

});

