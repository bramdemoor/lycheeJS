
lychee.define('game.Renderer').requires([
	'game.entity.Circle',
	'game.entity.Text'
]).includes([
	'lychee.Renderer'
]).exports(function(lychee, global) {

	var _circle = game.entity.Circle;
	var _text   = game.entity.Text;


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

