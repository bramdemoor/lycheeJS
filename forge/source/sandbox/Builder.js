
lychee.define('game.sandbox.Builder').requires([
	'game.sandbox.Main',
	'game.sandbox.State',
	'game.sandbox.Layer'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global) {

	var Class = function(game) {

		this.game = game;


		lychee.event.Emitter.call(this, 'sandbox-builder');

	};


	Class.prototype = {

		build: function(blob) {

console.log(blob);

		}

	};


	return Class;

});

