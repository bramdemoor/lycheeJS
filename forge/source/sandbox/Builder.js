
lychee.define('game.sandbox.Builder').requires([
	'game.sandbox.Main',
	'game.sandbox.State',
	'game.sandbox.Layer'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global) {

	var _env = lychee.getEnvironment();


	var Class = function(game) {

		this.game = game;

		this.preloader = new lychee.Preloader({
			timeout: Infinity
		});


		lychee.event.Emitter.call(this, 'sandbox-builder');

	};


	Class.prototype = {

		build: function(blob) {

			var tmp;


			var project = blob.project || null;
			if (project !== null) {

				var path = project.path;
				if (path.indexOf('project.json') !== -1) {
					tmp = path.split('/');
					tmp.pop();
					path = tmp.join('/');
				}


				lychee.debug = true;


				var sandboxenv = {};
				var sandboxglobal = { lychee: {} };


				lychee.setEnvironment(sandboxenv);


				// Avoid duplicated loading
				for (var id in _env.tree) {

					if (id.substr(0, 6) === 'lychee') {
						sandboxenv.tree[id] = _env.tree[id];
					}

				}

				for (var id in lychee) {
					if (typeof lychee[id] === 'function') {
						sandboxglobal.lychee[id] = lychee[id];
					}
				}


				lychee.rebase({
					lychee: _env.bases.lychee,
					game: path + '/source'
				});

				lychee.tag({
					platform: [ 'webgl', 'html' ]
				});


				this.preloader.load([
					path + '/source/Main.js'
				]);


				this.preloader.bind('ready', function(assets) {

					var that = this;

					lychee.build(function(lychee, global) {

						that.trigger('build', [ sandboxenv, sandboxglobal ]);

						lychee.setEnvironment(null);

					}, sandboxglobal);


				}, this);


global._SANDBOXENV = sandboxenv;
global._SANDBOXGLOBAL = sandboxglobal;


			}

console.log(blob);

		}

	};


	return Class;

});

