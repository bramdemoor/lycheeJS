
lychee.define('game.Main').requires([
	'lychee.Font',
	'lychee.Input',
	'lychee.Viewport',
	'game.Renderer',
	'game.entity.Font',
	'game.state.Scene',
	'game.state.Test',
	'game.DeviceSpecificHacks',
	'game.sandbox.Builder'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, global) {

	var Class = function(settings) {

		lychee.game.Main.call(this, settings);

		this.load();

	};


	Class.prototype = {

		defaults: {
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

				var state = this.getState();

				state.leave && state.leave();

				for (var id in this.__states) {
					this.__states[id].reset();
				}

				state.enter && state.enter();

			}

		},

		load: function() {

			var urls = [
				'/game/boilerplate/project.json'
			];


			this.preloader = new lychee.Preloader({
				timeout: Infinity
			});

			this.preloader.bind('ready', function(assets) {

				var blob = assets[urls[0]];
				blob.project.path = urls[0];

				this.init(blob);

			}, this);

			this.preloader.load(urls);

		},

		init: function(project) {

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
				this.stop();
			}, this);
			this.viewport.bind('show', function() {
				this.start();
			}, this);


			this.reset();


			this.input = new lychee.Input({
				delay:        0,
				fireModifier: false,
				fireKey:      true,
				fireTouch:    true,
				fireSwipe:    true
			});

			this.builder = new game.sandbox.Builder(this);


			this.fonts = {};
			this.fonts.headline = new game.entity.Font('headline');
			this.fonts.normal   = new game.entity.Font('normal');
			this.fonts.small    = new game.entity.Font('small');
			this.fonts.category = new game.entity.Font('category');
			this.fonts.label    = new game.entity.Font('label');


			this.addState('scene', new game.state.Scene(this));
			this.addState('test',  new game.state.Test(this));


			this.setState(
				'scene',
				project
			);

			this.start();

		}

	};


	return Class;

});
