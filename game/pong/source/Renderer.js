
lychee.define('game.Renderer').requires([
	'game.entity.Ball',
	'game.entity.Paddle'
]).includes([
	'lychee.Renderer'
]).exports(function(lychee, global) {

	var _ball   = game.entity.Ball;
	var _paddle = game.entity.Paddle;


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

