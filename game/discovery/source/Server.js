
lychee.define('game.Server').requires([
	'lychee.net.Server',
	'lychee.net.remote.RoomService'
]).exports(function(lychee, global) {

	var Class = function(settings) {


		this.__server = new lychee.net.Server(
			JSON.stringify, JSON.parse
		);

		this.__server.listen(
			settings.port || 1337,
			settings.host || 'localhost'
		);

		this.__server.bind('connect', function(remote) {

			remote.accept();

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});

