
lychee.define('game.MainServer').requires([
	'game.WebServer',
	'lychee.net.Server',
	'lychee.net.remote.RoomService'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.webserver = new game.WebServer({
			root: settings.root,
			port: 8080
		});


/*
		this.__server = new lychee.net.Server(
			JSON.stringify, JSON.parse
		);

		this.__server.listen(
			settings.port,
			settings.host
		);

		this.__server.bind('connect', function(remote) {

			remote.accept();

		}, this);
*/

	};


	Class.prototype = {

	};


	return Class;

});

