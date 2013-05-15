
lychee.define('game.sandbox.State').includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var Class = function(main, id) {

		lychee.game.State.call(this, main, id);


console.log('state', this);

	};


	Class.prototype = {
	};


	return Class;

});

