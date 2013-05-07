
lychee.define('game.state.Demo').includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.game.State.call(this, game, 'menu');

		this.__backbutton = null;
		this.__demo = null;

		this.reset();

	};


	Class.prototype = {

		reset: function() {

			var width  = 0;
			var height = 0;

			if (this.renderer !== null) {

				var env = this.renderer.getEnvironment();

				width  = env.width;
				height = env.height;

			}


			this.removeLayer('demo');
			this.removeLayer('ui');


			var ui   = new lychee.game.Layer();
			var demo = new lychee.game.Layer();


			var root = new lychee.ui.Area({
				width:  width,
				height: height,
				scrollable: false,
				position: {
					x: 0,
					y: 0
				}
			});

			ui.addEntity(root);


			var button = new lychee.ui.Button({
				label: '< Back',
				font: this.game.fonts.normal,
				position: {
					x: -1/2 * width + 96,
					y: -1/2 * height + 48
				}
			});

			button.bind('touch', function() {
				this.game.setState('menu');
			}, this);

			root.addEntity(button);



			this.addLayer('demo', demo);
			this.addLayer('ui', ui);

		},

		enter: function(id) {

			var valid = false;

			var construct = game.demo[id];
			if (typeof construct === 'function') {
				this.__demo = new construct(this);
				valid = true;
			}


			if (valid === true) {

				lychee.game.State.prototype.enter.call(this);

			} else {

				this.loop.timeout(0, function() {
					this.game.setState('menu');
				}, this);

			}

		},

		leave: function() {

			this.__demo = null;

			lychee.game.State.prototype.leave.call(this);

		}

	};


	return Class;

});
