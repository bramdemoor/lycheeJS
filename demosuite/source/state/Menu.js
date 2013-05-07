
lychee.define('game.state.Menu').requires([
	'lychee.ui.Area',
	'lychee.ui.Button',
	'game.demo.BitON',
	'game.demo.PO',
	'game.demo.RoomService'
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
			var width    = this.game.settings.width;
			var height   = this.game.settings.height;


			this.removeLayer('ui');


			var layer = new lychee.game.Layer();


			var root = new lychee.ui.Area({
				width:  width * 3,
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
				width:  width,
				height: height,
				scrollable: false,
				position: {
					x: 0,
					y: 0
				}
			});

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



			/*
			 * DEMO OVERVIEW
			 */

			var i = 0;
			for (var id in game.demo) {

				// Skip the Base Demo, which
				// is only the basic interface for others
				if (id === 'Base') continue;


				var label = game.demo[id].TITLE || id;

				entity = new lychee.ui.Button({
					label: label,
					font:  this.game.fonts.normal,
					position: {
						x: 0,
						y: -1/2 * height + 48 + i * 48
					}
				});


				(function(id, that) {

					entity.bind('#touch', function(entity) {
						this.game.setState('demo', id);
					}, that);

				})(id, this);


				welcome.addEntity(entity);
				i++;

			}



			entity = new lychee.ui.Button({
				label: 'Settings',
				font:  this.game.fonts.normal,
				position: {
					x: 0,
					y: -1/2 * height + 48 + i * 48 + 48
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
				width:  width,
				height: height,
				scrollable: false,
				position: {
					x: width,
					y: 0
				}
			});

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
				label: 'Fullscreen: ' + ((this.game.settings.fullscreen === true) ? 'On': 'Off'),
				font:  this.game.fonts.normal,
				position: {
					x: 0,
					y: -24
				}
			});

			entity.bind('#touch', function(entity) {

				var s = this.game.settings;
				s.fullscreen = !s.fullscreen;

				entity.setLabel('Fullscreen: ' + ((s.fullscreen === true) ? 'On': 'Off'));

				this.game.reset(null, null, true);

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
