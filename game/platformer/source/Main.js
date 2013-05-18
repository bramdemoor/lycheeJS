lychee.define('game.Main').requires([
	'lychee.Font',
	'lychee.Input',
	'lychee.Viewport',
	'game.Jukebox',
	'game.Renderer',
	'game.state.Game',
	'game.state.Menu',
	'game.DeviceSpecificHacks'
]).includes(['lychee.game.Main']).exports(function(lychee, global) {

	var Class = function(settings) {
		lychee.game.Main.call(this, settings);
		this.fonts = {};
		this.__offset = { x: 0, y: 0 };
		this.load();
	};

	Class.prototype = {

		defaults: {
			title: 'Platformer Demo',
			base: './asset',
			sound: true,
			music: true,
			fullscreen: true,
			renderFps: 60,
			updateFps: 60,
			width: 896,
			height: 386
		},

		load: function() {
			var base = this.settings.base;

			var urls = [
				base + '/img/font_48_white.png',
				base + '/img/font_32_white.png',
				base + '/img/font_16_white.png',
                base + '/img/jewel_32.png'
			];

			this.preloader = new lychee.Preloader({ timeout: 3000 });

			this.preloader.bind('ready', function(assets) {
				this.assets = assets;

				this.fonts.headline = new lychee.Font(assets[urls[0]], {
					kerning: 0,
					spacing: 8,
					map: [15,20,29,38,28,43,33,18,23,24,26,24,18,24,20,31,29,22,29,28,27,27,29,23,31,30,17,18,46,24,46,26,54,25,27,25,26,23,23,29,27,16,22,27,22,36,28,29,23,31,25,27,23,26,25,34,25,24,29,25,30,25,46,30,18,25,27,25,26,23,23,29,27,16,22,27,22,36,28,29,23,31,25,27,23,26,25,34,25,24,29,37,22,37,46]
				});

				this.fonts.normal = new lychee.Font(assets[urls[1]], {
					kerning: 0,
					spacing: 8,
					map: [12,15,21,28,21,30,24,14,17,18,19,18,14,18,15,23,21,17,21,21,20,20,21,18,22,22,14,14,33,18,33,20,38,19,20,19,19,18,18,21,20,13,16,20,16,26,21,21,18,22,19,20,17,20,18,24,19,18,21,18,22,18,33,22,14,19,20,19,19,18,18,21,20,13,16,20,16,26,21,21,18,22,19,20,17,20,18,24,19,18,21,26,17,26,33]
				});

				this.fonts.small = new lychee.Font(assets[urls[2]], {
					kerning: 0,
					spacing: 8,
					map: [9,11,14,17,13,18,15,10,12,12,13,12,10,12,11,14,14,11,14,13,13,13,14,12,14,14,10,10,19,12,19,13,22,12,13,12,13,12,12,14,13,9,11,13,11,16,13,14,12,14,12,13,12,13,12,15,12,12,14,12,14,12,19,14,10,12,13,12,13,12,12,14,13,9,11,13,11,16,13,14,12,14,12,13,12,13,12,15,12,12,14,16,11,16,19]
				});

                this.images = {
                    character: assets[urls[3]]
                };

				this.init();

			}, this);

			this.preloader.bind('error', function(urls) {
				if (lychee.debug === true) {
					console.warn('Preloader error for these urls: ', urls);
				}
			}, this);

			this.preloader.load(urls);
		},

		reset: function(width, height) {
			game.DeviceSpecificHacks.call(this);

			var env = this.renderer.getEnvironment();

			if (typeof width === 'number' && typeof height === 'number') {
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

			this.__offset = env.offset;
		},

		init: function() {
			lychee.Preloader.prototype._progress(null, null);

			lychee.game.Main.prototype.init.call(this);

			this.renderer = new game.Renderer('game');
			this.renderer.reset(this.settings.width, this.settings.height, true);
			this.renderer.setBackground("#222222");

			this.viewport = new lychee.Viewport();
			this.viewport.bind('reshape', function(orientation, rotation, width, height) {

				this.reset(width, height);

				for (var id in this.states) {
					this.states[id].reset();
				}

				var state = this.getState();
				state.leave && state.leave();
				state.enter && state.enter();

			}, this);
			this.viewport.bind('hide', function() {
				if (this.jukebox && this.jukebox.isPlaying('music') === true) {
					this.jukebox.stop('music');
				}

			}, this);
			this.viewport.bind('show', function() {
				if (this.jukebox && this.jukebox.isPlaying('music')) {
					this.jukebox.play('music');
				}
			}, this);

			this.reset();

			this.jukebox = new game.Jukebox(this);

			this.input = new lychee.Input({
				delay:        0,
				fireModifier: false,
				fireKey:      false,
				fireTouch:    true,
				fireSwipe:    false
			});

			this.states.game = new game.state.Game(this);
			this.states.menu = new game.state.Menu(this);

			this.setState('menu');

			this.start();
		},

		getOffset: function() {
			return this.__offset;
		}
	};

	return Class;

});
