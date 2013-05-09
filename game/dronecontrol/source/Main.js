
lychee.define('game.Main').requires([
	'lychee.Font',
	'lychee.Input',
	'lychee.Viewport',
	'lychee.net.Client',
	'game.Renderer',
	'game.entity.Font',
	'game.state.Game',
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
			title: 'boilerplate',
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
				this.settings.width = env.screen.width;
				this.settings.height = env.screen.height;
			} else {
				this.settings.width = this.defaults.width;
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

			// Remove Preloader Progress Bar
			lychee.Preloader.prototype._progress(null, null);


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

			}, this);
			this.viewport.bind('show', function() {

			}, this);


			this.reset();


			this.client = new lychee.net.Client(
				JSON.stringify, JSON.parse
			);

			this.client.bind('connect', function() {

			}, this);

			this.client.bind('disconnect', function(code, reason) {

				console.warn('Disconnect', code, reason);

			}, this);

			this.client.listen(
				1338,
				this.settings.host
			);



			this.input = new lychee.Input({
				delay:        0,
				fireModifier: false,
				fireKey:      false, // change to true for NodeJS support
				fireTouch:    true,
				fireSwipe:    true
			});

			this.fonts = {};
			this.fonts.normal = new game.entity.Font('normal');


			this.states.game = new game.state.Game(this);

			this.setState('game');

			this.start();

		}

	};


	return Class;

});
