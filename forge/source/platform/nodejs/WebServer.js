
lychee.define('game.WebServer').tags({
	platform: 'nodejs'
}).requires([
	'game.webserver.mod.FS',
	'game.webserver.mod.Error',
	'game.webserver.mod.File',
	'game.webserver.mod.Redirect',
	'game.webserver.mod.Welcome'
]).supports(function(lychee, global) {

	if (
		typeof process !== 'undefined'
	) {
		return true;
	}


	return false;

}).exports(function(lychee, global) {

	var http = require('http');
	var zlib = require('zlib');

	var _template = game.webserver.Template;
	var _mod = game.webserver.mod;



	/*
	 * AUTONOMOUS WEBSERVER
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__root   = typeof settings.root === 'string' ? settings.root : '/var/www';
		this.__host   = null;
		this.__port   = null;
		this.__server = null;
		this.__mods   = {};


		this.__mods.fs       = new _mod['FS'](this);
		this.__mods.error    = new _mod['Error'](this);
		this.__mods.file     = new _mod['File'](this);
		this.__mods.redirect = new _mod['Redirect'](this);
		this.__mods.welcome  = new _mod['Welcome'](this);


		this.__mods.fs.watch(this.__root);

		this.__mods.fs.add(
			this.__root, 'forge/backend.sjs',
			game.webserver.mod.FS.TYPE.link,
			'backend'
		);

	};


	Class.VERSION = 'lycheeJS ' + lychee.VERSION + ' WebServer (running on NodeJS)';


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		listen: function(port, host) {

			port = typeof port === 'number' ? port : 80;
			host = typeof host === 'string' ? host : null;


			if (lychee.debug === true) {
				console.log('game.WebServer: Listening on ' + host + ':' + port);
			}


			var that = this;

			this.__server = new http.Server();
			this.__server.on('request', function(request, response) {

				var accept_encoding = request.headers['accept-encoding'] || "";

				that.__handleRequest(request, function(data) {

					if (accept_encoding.match(/\bgzip\b/)) {

						zlib.gzip(data.body, function(err, buffer) {

							data.header['Content-Encoding'] = 'gzip';
							data.header['Content-Length']   = buffer.length;
							response.writeHead(data.status, data.header);

							if (!err) {
								response.write(buffer);
								response.end();
							} else {
								response.end();
							}

						});

					} else {

						data.header['Content-Length'] = data.body.length;

						response.writeHead(data.status, data.header);
						response.write(data.body);
						response.end();

					}

				});

			});
			this.__server.listen(port, host);


			this.__host = host;
			this.__port = port;


			var url = 'http://' + (host === null ? 'localhost' : host) + ':' + port;
			var welcome = 'game.WebServer: Ready. Navigate your Web Browser to: ' + url;


			var header = '';
			for (var w = 0, wl = welcome.length; w < wl; w++) {
				header += w % 2 === 0 ? '-' : '=';
			}

			console.log('\n');
			console.log(header);
			console.log(welcome);
			console.log(header);
			console.log('\n');

		},

		getHost: function() {
			return this.__host;
		},

		getMod: function(id) {

			if (this.__mods[id]) {
				return this.__mods[id];
			}


			return null;

		},

		getPort: function() {
			return this.__port;
		},

		getRoot: function() {
			return this.__root;
		},

		getVersion: function() {
			return Class.VERSION;
		},



		/*
		 * PRIVATE API
		 */

		__handleRequest: function(request, callback) {

			var error    = this.getMod('error');
			var fs       = this.getMod('fs');
			var file     = this.getMod('file');
			var redirect = this.getMod('redirect');
			var welcome  = this.getMod('welcome');


			var url = request.url;
			var resolved = null;
			if (fs !== null) {

				resolved = fs.resolve(this.__root + url);


				if (url === '/') {

					welcome.execute(url, callback);

				} else if (resolved !== null) {

					if (
						fs.isDirectory(resolved) === true
						&& fs.isFile(resolved + '/index.html') === true
					) {
						redirect.execute(resolved + '/index.html', callback);
					} else if (fs.isFile(resolved) === true) {
						file.execute(resolved, callback);
					} else {
						error.execute(403, url + ' (' + resolved + ')', callback);
					}

				} else {
					error.execute(404, url + ' (' + resolved + ')', callback);
					this.__mods.fs.refresh();
				}

			} else {
				error.execute(500, url, callback);
			}

		}

	};


	return Class;

});

