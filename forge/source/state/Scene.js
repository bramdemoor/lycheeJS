
lychee.define('game.state.Scene').requires([
	'game.entity.ui.Layers',
	'game.entity.ui.Navigation',
	'game.entity.ui.Properties',
	'game.entity.ui.Sandbox',
	'game.sandbox.Main',
	'game.sandbox.State',
	'game.sandbox.Layer'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var _ui    = game.entity.ui;
	var _main  = game.sandbox.Main;
	var _state = game.sandbox.State;
	var _layer = game.sandbox.Layer;


	var _resolve_constructor = function(identifier, scope) {

		var pointer = scope;

		var ns = identifier.split('.');
		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}


		return pointer;

	};


	var Class = function(game) {

		lychee.game.State.call(this, game, 'test');


		this.__entities = {
			layers:     null,
			navigation: null,
			properties: null
		};


		this.reset();

	};


	Class.prototype = {

		reset: function() {

			var env    = this.renderer.getEnvironment();
			var width  = env.width;
			var height = env.height;


			// TODO: Make this more generic,
			// dependent on current screen
			// resolution and dpi-resolution
			var tile = 32;


			this.removeLayer('ui');


			var layer = new lychee.game.Layer();


			var navigation = new _ui.Navigation({
				width:    width - tile * 12,
				height:   2 * tile,
				position: {
					x: 0,
					y: -1/2 * height + tile
				},
				scrollable: false
			}, this);

			layer.addEntity(navigation);


			var layers = new _ui.Layers({
				width:    tile * 6,
				height:   height,
				position: {
					x: -1/2 * width + 3 * tile,
					y: 0
				},
				scrollable: false
			}, this);

			layer.addEntity(layers);


			var properties = new _ui.Properties({
				width:    tile * 6,
				height:   height,
				position: {
					x: 1/2 * width - 3 * tile,
					y: 0
				},
				scrollable: false
			}, this);

			layer.addEntity(properties);


			var sandbox = new _ui.Sandbox({
				width: width - tile * 12,
				height: height - tile * 2,
				position: {
					x: 0,
					y: tile
				}
			}, this);

			layer.addEntity(sandbox);


			navigation.bind('select', function(project) {
				this.game.builder.build(project);
			}, this);

			layers.bind('select', function(layer, entity) {
				properties.refresh(layer, entity);
			}, this);

			properties.bind('change', function(layer, entity, diff) {
				console.log('CHANGES: ', layer, entity, diff);
			}, this);


			this.__entities.layers     = layers;
			this.__entities.navigation = navigation;
			this.__entities.properties = properties;


			this.addLayer('ui', layer);

		},

		enter: function(project) {

			this.game.builder.bind('build', this.__processBuild, this);

			if (project instanceof Object) {
				this.game.builder.build(project);
			}


			lychee.game.State.prototype.enter.call(this);

		},

		leave: function() {

			this.game.builder.unbind('build', this.__processBuild, this);


			lychee.game.State.prototype.leave.call(this);

		},



		/*
		 * PRIVATE API
		 */

		__processBuild: function(environment, sandbox) {

console.log('SANDBOXED BUILD READY', environment, sandbox);

		},

		__parseProject: function(blob) {

			this.removeLayer('project');


			var wrapper = new lychee.game.Layer();


			if (blob.project instanceof Object) {
				this.__entities.navigation.refresh(blob.project);
			}


			if (blob.states instanceof Object) {

				var sandbox = {};
				var sandboxenv = {};

				lychee.setEnvironment(sandboxenv);


				var main = new _main({});

				for (var s = 0, sl = blob.states.length; s < sl; s++) {

					var statedata = blob.states[s];
					var state = new _state(main, statedata.id);

					for (var id in statedata.layers) {

						var layerdata = statedata.layers[id];
						var layer = new _layer();

						for (var e = 0, el = layerdata.entities.length; e < el; e++) {

							var entitydata = layerdata.entities[e];
							var entity = null;

							var construct = _resolve_constructor(entitydata.constructor, sandbox);
							if (typeof construct === 'function') {

								var bindargs = entitydata.arguments;
								bindargs.reverse();
								bindargs.push(construct);
								bindargs.reverse();

								entity = new (
									construct.bind.apply(
										construct,
										args
									)
								)();

							}

							console.log(entity);

						}

						state.addLayer((layerdata.id + '').toLowerCase(), layer);

					}

					main.addState((statedata.id + '').toLowerCase(), state);

				}


				lychee.setEnvironment(null);

			}


			this.addLayer('project', wrapper);

		}

	};


	return Class;

});
