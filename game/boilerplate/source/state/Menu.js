
lychee.define('game.state.Menu').requires([
	'lychee.ui.Area',
	'lychee.ui.Button'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.game.State.call(this, game, 'menu');


		this.__cache = {
			x: 0, y: 0
		};


		this.reset();

	};


	Class.prototype = {

		reset: function() {

			var entity   = null;
			var settings = this.game.settings;
			var width    = settings.width;
			var height   = settings.height;


			this.removeLayer('ui');


			var layer = new lychee.game.Layer();


			var root = new lychee.ui.Area({
				width:  width,
				height: height,
				scrollable: true,
				position: {
					x: 0,
					y: 0
				}
			});

			layer.addEntity(root);



			/*
			 * WELCOME MENU
			 */

			var welcome = new lychee.ui.Area({
				width:  400,
				height: 300,
				scrollable: false,
				position: {
					x: -200,
					y: 0
				}
			});

welcome.background = '#00ff00';

			root.addEntity(welcome);


			entity = new lychee.ui.Button({
				label: this.game.settings.title,
				font:  this.game.fonts.headline,
				position: {
					x: 0,
					y: -1 * height / 2 + 64
				}
			});

			welcome.addEntity(entity);


			entity = new lychee.ui.Button({
				label: 'powered by lycheeJS',
				font:  this.game.fonts.small,
				position: {
					x: 0,
					y: height / 2 - 32
				}
			});

			welcome.addEntity(entity);


			entity = new lychee.ui.Button({
				label: 'New Game',
				font:  this.game.fonts.normal,
				position: {
					x: 0,
					y: -24
				}
			});

			entity.bind('touch', function() {
				this.game.setState('game');
			}, this);

			welcome.addEntity(entity);


			entity = new lychee.ui.Button({
				label: 'Settings',
				font:  this.game.fonts.normal,
				position: {
					x: 0,
					y: 24
				}
			});

			entity.bind('touch', function() {

				var position = this.__cache;

				position.x = -1 * width;
				position.y = 0;

				root.setPosition(position);

			}, this);

			welcome.addEntity(entity);



			/*
			 * SETTINGS MENU
			 */

			var settings = new lychee.ui.Area({
				width:  400,
				height: 300,
				scrollable: false,
				position: {
					x: 200,
					y: 0
				}
			});

settings.background = '#0000ff';

			root.addEntity(settings);


			entity = new lychee.ui.Button({
				label: 'Settings',
				font:  this.game.fonts.headline,
				position: {
					x: 0,
					y: -1 * height / 2 + 64
				}
			});

			entity.bind('touch', function() {

				var position = this.__cache;

				position.x = 0;
				position.y = 0;

				root.setPosition(position);

			}, this);

			settings.addEntity(entity);


			entity = new lychee.ui.Button({
				label: 'powered by lycheeJS',
				font:  this.game.fonts.small,
				position: {
					x: 0,
					y: height / 2 - 32
				}
			});

			settings.addEntity(entity);


			entity = new lychee.ui.Button({
				label: 'Fullscreen: ' + ((settings.fullscreen === true) ? 'On': 'Off'),
				font:  this.game.fonts.normal,
				position: {
					x: 0,
					y: -24
				}
			});

			entity.bind('#touch', function(entity) {

				settings.fullscreen = !settings.fullscreen;

console.log(entity);

			}, this);

			settings.addEntity(entity);




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
