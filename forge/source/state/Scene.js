
lychee.define('game.state.Scene').requires([
	'game.ui.Navigation'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.game.State.call(this, game, 'scene');

		this.reset();

	};


	Class.prototype = {

		reset: function() {

			var layer = new lychee.game.Layer();


			var navigation = new game.ui.Navigation(this.game);

			layer.addEntity(navigation);


			this.addLayer('ui', layer);

		},

		enter: function() {

			lychee.game.State.prototype.enter.call(this);

		},

		leave: function() {

			lychee.game.State.prototype.leave.call(this);

		}

	};


	return Class;

});
