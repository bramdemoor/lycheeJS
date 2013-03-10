
lychee.define('game.webserver.mod.Welcome').requires([
	'game.webserver.Template'
]).exports(function(lychee, global, attachments) {

	var _html     = attachments['html'] || null;
	var _template = game.webserver.Template;


	var Class = function(webserver) {

		this.__template  = null;
		this.__webserver = webserver;


		if (_html !== null) {
			this.__template = new _template(_html);
		}

	};


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		execute: function(url, callback) {

			var webserver = this.__webserver;


			var content = '';

			if (this.__template !== null) {

				var host    = webserver.getHost();
				var port    = webserver.getPort();
				var version = webserver.getVersion();


				try {

					content = this.__template.render({

						games_list: this.__generateGamesList(),

						webserver_host: host,
						webserver_port: port,
						webserver_version: version

					});

				} catch(e) {

console.error(e);

					content = '';

				}

			}


			callback({
				status: 200,
				header: {
					'Content-Type':   'text/html',
					'Content-Length': content.length
				},
				body: content
			});

		},



		/*
		 * PRIVATE API
		 */

		__generateGamesList: function() {

return [ 'foo', 'bar' ];

			var root  = this.__webserver.getRoot();
			var rl    = root.length;
			var fsmod = this.__webserver.getMod('fs');


			var list = [];
			var entries = fsmod.all();
			for (var e = 0, el = entries.length; e < el; e++) {

				var path  = entries[e];
				var chunk = path.substr(rl);

				if (
					path.substr(0, rl) === root
					&& chunk.substr(0, 5) === '/game'
					&& chunk.substr(-10) === 'index.html'
				) {

					list.push({
						id:  chunk.substr(0, chunk.length - 10),
						url: chunk
					});

				}

			}


			return list;

		}

	};


	return Class;

});

