
lychee.define('game.demo.RoomService').requires([
	'lychee.net.client.RoomService',
	'lychee.net.Client'
]).includes([
	'game.demo.Base'
]).exports(function(lychee, global) {

	var _base = game.demo.Base;

	var Demo = function(state) {

		_base.call(this, state);


		this.__client  = null;
		this.__service = null;


		this.__client = new lychee.net.Client(
			JSON.stringify, JSON.parse
		);


		this.__client.bind('connect', function() {

			this.__service = new lychee.net.client.RoomService();
			this.__service.bind('ready', this.__refresh, this);
			this.__client.plug(this.__service);

		}, this);

		this.__client.bind('disconnect', function(code, reason) {

			console.warn('Disconnect', code, reason);

		}, this);

		this.__client.listen(
			this.game.settings.port || 1337,
			this.game.settings.host || 'localhost'
		);

	};

	Demo.TITLE = 'lychee.net: RoomService';

	Demo.prototype = {

		__refresh: function() {

			var service = this.__service;
			if (service !== null) {

				service.command('refresh').then(function() {

				}, function() {
				}, this);

			}

			if (this.__service !== null) {
				this.__service.command('enter');
			}

console.log('REFRESHING', this.__service);

		}

	};


	return Demo;

});

