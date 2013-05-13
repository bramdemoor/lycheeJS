
lychee.define('game.state.Scene').requires([
	'game.entity.ui.Area'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var _ui = game.entity.ui;


	var Class = function(game) {

		lychee.game.State.call(this, game, 'test');

		this.reset();

	};


	Class.prototype = {

		reset: function() {

			var env    = this.renderer.getEnvironment();
			var width  = env.width;
			var height = env.height;


			// TODO: Make this more generic,
			// dependent on current screen
			// resolution and dpi-resolution
			var tile = 32;


			this.removeLayer('ui');


			var layer = new lychee.game.Layer();


			var navigation = new _ui.Navigation({
				width:    width - tile * 12,
				height:   2 * tile,
				position: {
					x: 0,
					y: -1/2 * height + tile
				},
				scrollable: false
			});

			layer.addEntity(navigation);


			var layers = new _ui.Layers({
				width:    tile * 6,
				height:   height,
				position: {
					x: -1/2 * width + 3 * tile,
					y: 0
				},
				scrollable: false
			});

			layer.addEntity(layers);


			var properties = new _ui.Properties({
				width:    tile * 6,
				height:   height,
				position: {
					x: 1/2 * width - 3 * tile,
					y: 0
				},
				scrollable: false
			});

			layer.addEntity(properties);


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
