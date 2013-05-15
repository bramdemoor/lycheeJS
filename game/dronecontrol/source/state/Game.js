
lychee.define('game.state.Game').requires([
	'lychee.ui.Button',
	'game.entity.Circle'
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
					method: 'heave',
					value:  0.5
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
					method: 'heave',
					value:  -0.5
				});

			}, this);

			layer.addEntity(entity);


			entity = new lychee.ui.Button({
				label: 'Barrel Roll!',
				font:  this.game.fonts.normal,
				position: {
					x: 0,
					y: 128
				}
			});

			entity.bind('touch', function() {

				this.__client.send({
					method: 'animateFlight',
					type:   'flipAhead',
					value:  1000
				});

/*
				this.__client.send({
					method: 'animateLEDs',
					type: 'blinkOrange',
					value: 4000
				});
*/

// animateLEDs('blinkOrange', 1000);

/*
				this.__client.send({
					method: 'yaw',
					value:  0.2
				});
*/
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
