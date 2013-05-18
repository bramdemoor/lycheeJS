
lychee.define('game.state.Game').requires([
	'game.logic.Game'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.game.State.call(this, game, 'game');


		this.__cache = {
			x: 0, y: 0
		};


		this.reset();

	};


	Class.prototype = {

		reset: function() {

			var entity = null;
			var width  = this.game.settings.width;
			var height = this.game.settings.height;


			this.removeLayer('ui');


			var layer = new lychee.game.Layer();


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

