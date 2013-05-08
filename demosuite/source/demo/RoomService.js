
lychee.define('game.demo.RoomService').requires([
	'lychee.ui.Button',
	'lychee.ui.Input',
	'lychee.net.client.RoomService',
	'lychee.net.Client'
]).includes([
	'game.demo.Base'
]).exports(function(lychee, global) {

	var _base = game.demo.Base;

	var Demo = function(state) {

		var fonts    = state.game.fonts;
		var settings = state.game.settings;

		_base.call(this, state);



		this.__client  = null;
		this.__service = null;



		/*
		 * UI
		 */

		var layer = state.getLayer('demo');

		this.__entities.name = new lychee.ui.Input({
			font: fonts.normal,
			type: lychee.ui.Input.TYPE.text,
			value: 'Enter your name',
			width: 400,
			height: 48,
			position: {
				x: 0,
				y: 0
			}
		});

		this.__entities.connect = new lychee.ui.Button({
			label: 'Connect',
			font: fonts.normal,
			position: {
				x: 0,
				y: 48
			}
		});

		this.__entities.connect.bind('touch', function() {

			var user = this.__entities.name.getValue();
			if (typeof name === 'string') {

				if (this.__service !== null) {
					this.__service.enter(user, 0);
				}

			}

		}, this);


		layer.addEntity(this.__entities.name);
		layer.addEntity(this.__entities.connect);



		/*
		 * CLIENT AND SERVICE
		 */

		this.__client  = null;
		this.__service = null;


		var client = new lychee.net.Client(
			JSON.stringify, JSON.parse
		);

		client.bind('connect', function() {

			var service = new lychee.net.client.RoomService(client);

			// service.bind('ready', function() {
			// 	service.enter();
			// }, this);

			service.bind('refresh', this.__refresh, this);

global._SERVICE = service;

			client.plug(service);
			this.__service = service;

		}, this);

		client.bind('disconnect', function(code, reason) {

			console.warn('Disconnect', code, reason);

		}, this);

		client.listen(
			settings.port,
			settings.host
		);


		this.__client = client;

	};

	Demo.TITLE = 'lychee.net: RoomService';

	Demo.prototype = {

		__refresh: function(userId, roomId, users, messages) {

console.log('GOT THIS DATA FROM SERVER', userId, roomId, users, messages);

		}

	};


	return Demo;

});

