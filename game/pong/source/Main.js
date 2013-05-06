
lychee.define('game.Main').requires([
	'lychee.Font',
	'lychee.Input',
	'lychee.Viewport',
	'game.Renderer',
	'game.entity.Font',
	'game.state.Game',
	'game.state.Menu',
	'game.DeviceSpecificHacks'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, global) {

	var Class = function(settings) {

		lychee.game.Main.call(this, settings);

		this.init();

	};


	Class.prototype = {

		defaults: {
			title: 'Pong Game',
			base: './asset',
			sound: true,
			music: true,
			fullscreen: false,
			renderFps: 60,
			updateFps: 60,
			width: 896,
			height: 386
		},

		reset: function(width, height, states) {

			game.DeviceSpecificHacks.call(this);

			var env = this.renderer.getEnvironment();

			if (
				typeof width === 'number'
				&& typeof height === 'number'
			) {
				env.screen.width  = width;
				env.screen.height = height;
			}


			if (this.settings.fullscreen === true) {
				this.settings.width  = env.screen.width;
				this.settings.height = env.screen.height;
			} else {
				this.settings.width  = this.defaults.width;
				this.settings.height = this.defaults.height;
			}


			this.renderer.reset(this.settings.width, this.settings.height, false);


			if (states === true) {

				var state = this.getState();

				state.leave && state.leave();

				for (var id in this.states) {
					this.states[id].reset();
				}

				state.enter && state.enter();

			}

		},

		init: function() {

			lychee.game.Main.prototype.init.call(this);

			this.renderer = new game.Renderer('game');
			this.renderer.reset(
				this.settings.width,
				this.settings.height,
				true
			);
			this.renderer.setBackground("#222222");


			this.viewport = new lychee.Viewport();
			this.viewport.bind('reshape', function(orientation, rotation, width, height) {
				this.reset(width, height, true);
			}, this);
			this.viewport.bind('hide', function() {
				this.stop();
			}, this);
			this.viewport.bind('show', function() {
				this.start();
			}, this);


			this.reset();


			this.input = new lychee.Input({
				delay:        0,
				fireModifier: false,
				fireKey:      false, // change to true for NodeJS support
				fireTouch:    true,
				fireSwipe:    false
			});


			this.fonts = {};
			this.fonts.headline = new game.entity.Font('headline');
			this.fonts.normal   = new game.entity.Font('normal');
			this.fonts.small    = new game.entity.Font('small');


			this.states.game = new game.state.Game(this);
			this.states.menu = new game.state.Menu(this);

			this.setState('menu');

			this.start();

		}

	};


	return Class;

});
