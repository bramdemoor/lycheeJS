
lychee.define('game.Main').requires([
	'lychee.Font',
	'lychee.Input',
	'lychee.Viewport',

	'game.Camera',
	'game.Player',
	'game.Renderer',
	'game.World',

	'game.state.Game',
	'game.DeviceSpecificHacks'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, global) {

	var _instanceId = 0;

	var Class = function(settings) {

		lychee.game.Main.call(this, settings);


		// This is required for multiple instances
		this._settings = {
			width:  settings.width,
			height: settings.height
		};

		this.fonts   = {};
		this.ships   = [];
		this.worlds  = [];
		this.sprites = null;
		this.jukebox = null;

		this.__id      = 'zeromode7-' + _instanceId++;
		this.__offset  = { x: 0, y: 0 };
		this.__track   = null;
		this.__players = [];

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
			width: 640,
			height: 480,
			distance: 400
		},

		load: function() {

			var base = this.settings.base;

			var urls = [
				base + '/img/font_48_white.png',
				base + '/img/font_32_white.png',
				base + '/img/font_16_white.png',

				// Playable Ships
				base +  '/img/ships.png',
				base + '/json/ships.json',

				// 1. world: An Teallach
				base +  '/img/an-teallach.png',
				base + '/json/an-teallach.json'

				// 2. world: Blue Desert
				// base +  '/img/blue-desert.png',
				// base + '/json/blue-desert.json'

			];


			this.preloader = new lychee.Preloader({
				timeout: Infinity
			});

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
					'ships':       assets[urls[3]],
					'an-teallach': assets[urls[5]]
				};


				this.init(assets[urls[4]], [
					assets[urls[6]] // An Teallach
				]);

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

				// MUHAHA. The only thing I need to add here ;)
				if (_instanceId > 1 && typeof width === 'number') {

					var amount = _instanceId;

					this.settings.width  = Math.max(width, this._settings.width);
					this.settings.height = (height / amount) - (amount * 2); // 2px distance

				} else {
					this.settings.width  = this._settings.width;
					this.settings.height = this._settings.height;
				}

			}


			this.camera.reset(this.settings.width, this.settings.height);
			this.renderer.reset(this.settings.width, this.settings.height, false);

			this.__offset = env.offset; // Linked

		},

		init: function(ships, worlds) {

			lychee.game.Main.prototype.init.call(this);

			this.camera = new game.Camera(
				this.settings.width,
				this.settings.height,
				1.2 // camera height ratio
			);

			this.renderer = new game.Renderer(this.__id);
			this.renderer.reset(
				this.settings.width,
				this.settings.height,
				true
			);
			this.renderer.setBackground("#92c9ef");


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

			}, this);
			this.viewport.bind('show', function() {

			}, this);


			this.reset();


			this.input = new lychee.Input({
				delay:        0,
				fireModifier: false,
				fireKey:      true, // change to true for NodeJS support
				fireTouch:    true,
				fireSwipe:    false
			});


			this.states.game = new game.state.Game(this);


			var data;

			for (var s = 0, sl = ships.length; s < sl; s++) {

				data = ships[s];
				data.image = this.images.ships;

				this.ships.push(new game.entity.Ship(data));

			}

			for (var w = 0, wl = worlds.length; w < wl; w++) {

				data = worlds[w];
				data.image = this.images[data.id] || null;

				this.worlds.push(new game.World(data));

			}


			this.setTrack('an-teallach', 'valley');


			var player = this.getPlayer('local');
			if (player === null) {

				player = new game.Player('local', game.Player.TYPE.human);
				player.setShip(this.ships[0]);

				this.addPlayer(player);

			} else {
				player.setShip(this.ships[0]);
			}


			this.setState('game');

			this.start();

		},

		getPlayers: function() {
			return this.__players;
		},

		getPlayer: function(id) {

			var found = null;

			for (var p = 0, pl = this.__players.length; p < pl; p++) {

				if (this.__players[p].getId() === id) {
					found = this.__players[p];
					break;
				}

			}


			return found;

		},

		addPlayer: function(player) {
			this.__players.push(player);
		},

		removePlayer: function(id) {

			var found = false;

			for (var p = 0, pl = this.__players.length; p < pl; p++) {

				if (this.__players[p].getId() === id) {
					found = true;
					this.__players.splice(p, 1);
					pl--;
				}

			}


			return found;

		},

		getTrack: function() {
			return this.__track;
		},

		setTrack: function(world, track) {

			var found = null;

			for (var w = 0, wl = this.worlds.length; w < wl; w++) {

				if (this.worlds[w].getId() === world) {

					var result = this.worlds[w].getTrack(track);
					if (result !== null) {
						found = result;
						break;
					}

				}

			}


			this.__track = found;


			return found !== null;

		},

		getOffset: function() {
			return this.__offset;
		}

	};


	return Class;

});
