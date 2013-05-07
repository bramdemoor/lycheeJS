
lychee.define('game.demo.RoomService').requires([
	'lychee.net.client.RoomService',
	'lychee.net.Client'
]).includes([
	'game.demo.Base'
]).exports(function(lychee, global) {

	var _base = game.demo.Base;

	var Demo = function(state) {

		_base.call(this, state);


		var settings = state.game.settings;


		this.__client  = null;
		this.__service = null;


		this.__client = new lychee.net.Client(
			JSON.stringify, JSON.parse
		);


		this.__client.bind('connect', function() {

			this.__service = new lychee.net.client.RoomService(this.__client);
			this.__service.bind('#ready', function(service) {
				service.enter();
			}, this);
			this.__service.bind('update', this.__update, this);
			this.__client.plug(this.__service);

		}, this);

		this.__client.bind('disconnect', function(code, reason) {

			console.warn('Disconnect', code, reason);

		}, this);

		this.__client.listen(
			settings.port,
			settings.host
		);

	};

	Demo.TITLE = 'lychee.net: RoomService';

	Demo.prototype = {

		__update: function(data) {

console.log('GOT THIS DATA FROM SERVER', data);

		}

	};


	return Demo;

});

