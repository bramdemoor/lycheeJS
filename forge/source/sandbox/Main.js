
lychee.define('game.sandbox.Main').includes([
	'lychee.game.Main'
]).exports(function(lychee, global) {

	var Class = function(settings) {

		lychee.game.Main.call(this, settings);

console.log('state', this);

	};


	Class.prototype = {

		init: function() {
		}

	};


	return Class;

});

