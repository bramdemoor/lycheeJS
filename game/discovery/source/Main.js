
lychee.define('game.Main').requires([
	'lychee.Font',
	'lychee.Input',
	'lychee.Viewport',
	'game.Renderer',
	'game.entity.Font',
	'game.state.Demo',
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
			base: './asset',
			fullscreen: true,
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

				for (var id in this.states) {
					this.states[id].reset();
				}

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


			this.input = new lychee.Input({
				delay:        0,
				fireModifier: false,
				fireKey:      true,
				fireTouch:    true,
				fireSwipe:    false
			});


			this.fonts = {};
			this.fonts.headline = new game.entity.Font('headline');
			this.fonts.normal   = new game.entity.Font('normal');
			this.fonts.small    = new game.entity.Font('small');

			this.fonts.ubuntu20      = new game.entity.Font('ubuntu20');
			this.fonts.ubuntu20_bold = new game.entity.Font('ubuntu20_bold');


			this.addState('demo', new game.state.Demo(this));
			this.addState('menu', new game.state.Menu(this));

			this.setState('menu');

			this.start();

		}

	};


	return Class;

});
