
lychee.define('game.webserver.mod.Redirect').requires([
	'game.webserver.Template'
]).exports(function(lychee, global) {

	var Class = function(webserver) {

		this.__webserver = webserver;

	};


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		execute: function(url, callback) {

			var root   = this.__webserver.getRoot();
			var target = url.substr(root.length);

			callback({
				status: 301,
				header: {
					'Location': target
				},
				body: ''
			});

		}

	};


	return Class;

});

