
lychee.define('game.Main').requires([
	'lychee.Font',
	'lychee.Input',
	'lychee.Viewport',
	'game.Jukebox',
	'game.Renderer',
	'game.entity.Font',
	'game.state.Game',
	'game.state.Menu',
	'game.state.Result',
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
			title: 'Jewelz',
			base: './asset',
			sound: true,
			music: true,
			fullscreen: true,
			play: {
				hits:  3,
				intro: 5000,
				hint:  2000,
				time:  30000
			},
			renderFps: 60,
			updateFps: 60,
			width:     896,
			height:    384,
			tile:      64
		},

		reset: function(width, height, states) {

			game.DeviceSpecificHacks.call(this);


			var env = this.renderer.getEnvironment();
			var settings = this.settings;

			if (
				typeof width === 'number'
				&& typeof height === 'number'
			) {
				env.screen.width  = width;
				env.screen.height = height;
			}


			if (settings.fullscreen === true) {
				settings.width  = env.screen.width;
				settings.height = env.screen.height;
			} else {
				settings.width  = this.defaults.width;
				settings.height = this.defaults.height;
			}


			this.renderer.reset(settings.width, settings.height, true);


			if (states === true) {

				var state = this.getState();

				state.leave && state.leave();

				for (var id in this.__states) {
					this.__states[id].reset();
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

				this.stop();

			}, this);
			this.viewport.bind('show', function() {

				if (
					this.jukebox
					&& this.jukebox.isPlaying('music') === true
				) {
					this.jukebox.play('music');
				}

				this.start();

			}, this);


			this.reset();


			this.jukebox = new game.Jukebox(this);

			this.input = new lychee.Input({
				delay:        0,
				fireKey:      false, // change to true for NodeJS support
				fireModifier: false,
				fireTouch:    true,
				fireSwipe:    false
			});


			this.fonts = {};
			this.fonts.headline = new game.entity.Font('headline');
			this.fonts.normal   = new game.entity.Font('normal');
			this.fonts.small    = new game.entity.Font('small');


			this.addState('game',   new game.state.Game(this));
			this.addState('result', new game.state.Result(this));
			this.addState('menu',   new game.state.Menu(this));

			this.setState('menu');

			this.start();

		}

	};


	return Class;

});
