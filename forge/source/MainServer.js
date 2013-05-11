
lychee.define('game.MainServer').requires([
	'game.WebServer',
	'lychee.net.Server',
	'lychee.net.remote.RoomService'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.server = new lychee.net.Server(
			JSON.stringify, JSON.parse
		);

		this.server.bind('connect', function(remote) {

			remote.accept();

		}, this);

		this.server.listen(1337);


		this.webserver = new game.WebServer({
			root: settings.root
		});

		this.webserver.listen(8080);

	};


	Class.prototype = {

	};


	return Class;

});

