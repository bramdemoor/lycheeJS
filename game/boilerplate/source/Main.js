
lychee.define('game.Main').requires([
	'lychee.Font',
	'lychee.Input',
	'lychee.Viewport',
	'game.Jukebox',
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

		this.load();

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

		load: function() {

			// Nothing to load, so initialize
			this.init();


			/*
			 * PRELOADING EXAMPLE
			 */

			/*

			var base = this.settings.base;

			var urls = [
				base + '/img/example.png'
			];


			this.preloader = new lychee.Preloader({
				timeout: Infinity
			});

			this.preloader.bind('ready', function(assets) {

				// console.log(urls[0], assets[urls[0]]);

				this.assets = assets;
				this.init();

			}, this);

			this.preloader.bind('error', function(urls) {
				if (lychee.debug === true) {
					console.warn('Preloader error for these urls: ', urls);
				}
			}, this);

			this.preloader.load(urls);

			*/

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

				if (
					this.jukebox
					&& this.jukebox.isPlaying('music') === true
				) {
					this.jukebox.stop('music');
				}

			}, this);
			this.viewport.bind('show', function() {

				if (
					this.jukebox
					&& this.jukebox.isPlaying('music')
				) {
					this.jukebox.play('music');
				}

			}, this);


			this.reset();


			this.jukebox = new game.Jukebox(this);

			this.input = new lychee.Input({
				delay:        0,
				fireModifier: false,
				fireKey:      false, // change to true for NodeJS support
				fireTouch:    true,
				fireSwipe:    true
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
