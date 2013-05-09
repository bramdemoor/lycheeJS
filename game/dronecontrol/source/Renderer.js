
lychee.define('game.Renderer').requires([
	'game.entity.Circle'
]).includes([
	'lychee.Renderer'
]).exports(function(lychee, global) {

	var Class = function(id) {

		lychee.Renderer.call(this, id);

	};

	Class.prototype = {

		/*
		 * CUSTOM API
		 */

	};


	return Class;

});

