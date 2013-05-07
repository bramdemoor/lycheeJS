
lychee.define('game.state.Game').requires([
	'game.entity.Circle',
	'game.entity.Text'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.game.State.call(this, game, 'menu');

		this.__client = this.game.client;

		this.reset();

	};


	Class.prototype = {

		reset: function() {

			var width  = this.game.settings.width;
			var height = this.game.settings.height;


			var entity;


			this.removeLayer('ui');


			var layer = new lychee.game.Layer();


			entity = new lychee.ui.Button({
				label: 'Takeoff',
				font:  this.game.fonts.normal,
				position: {
					x: -1/2 * width + 128,
					y: 0
				}
			});

			entity.bind('touch', function() {

				this.__client.send({
					method: 'takeoff',
					value:  null
				});

			}, this);

			layer.addEntity(entity);


			entity = new lychee.ui.Button({
				label: 'Land',
				font:  this.game.fonts.normal,
				position: {
					x: -1/2 * width + 256,
					y: 0
				}
			});

			entity.bind('touch', function() {

				this.__client.send({
					method: 'land',
					value:  null
				});

			}, this);

			layer.addEntity(entity);


			entity = new lychee.ui.Button({
				label: 'Up',
				font:  this.game.fonts.normal,
				position: {
					x: -1/2 * width + 512,
					y: 0
				}
			});

			entity.bind('touch', function() {

				this.__client.send({
					method: 'up',
					value:  1.0
				});

			}, this);

			layer.addEntity(entity);


			entity = new lychee.ui.Button({
				label: 'Down',
				font:  this.game.fonts.normal,
				position: {
					x: -1/2 * width + 768,
					y: 0
				}
			});

			entity.bind('touch', function() {

				this.__client.send({
					method: 'down',
					value:  1.0
				});

			}, this);

			layer.addEntity(entity);


			entity = new lychee.ui.Button({
				label: 'DO A BARREL ROLL!',
				font:  this.game.fonts.normal,
				position: {
					x: 0,
					y: 128
				}
			});

			entity.bind('touch', function() {

				this.__client.send({
					method: 'barrelroll',
					value:  2000
				});

			}, this);

			layer.addEntity(entity);



			this.addLayer('ui', layer);

		},

		enter: function() {

			lychee.game.State.prototype.enter.call(this);

		},

		leave: function() {

			lychee.game.State.prototype.leave.call(this);

		}

	};


	return Class;

});
