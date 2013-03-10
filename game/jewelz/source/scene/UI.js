
lychee.define('game.scene.UI').requires([
	'game.Score'
]).exports(function(lychee, global) {

	var Class = function(game, settings) {

		this.game = game;

		this.__background = [];
		this.__loop     = game.loop;
		this.__root     = null;
		this.__renderer = game.renderer;

		// Score is public for state.Game access
		this.score = null;


		this.reset(settings);

	};


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		reset: function(data) {

			if (this.__root === null) {

				this.score = new game.Score();


				this.__entities = {};

				this.__root = new lychee.ui.Area({
					width:  data.width,
					height: data.height,
					position: {
						x: data.position.x,
						y: data.position.y
					}
				});


				this.__root.add(new lychee.ui.Button({
					label: 'Score: ',
					font:  this.game.fonts.normal,
					position: {
						x: 0, y: -84
					}
				}));

				this.__entities.points = new lychee.ui.Button({
					label: '0',
					font:  this.game.fonts.normal,
					position: {
						x: 0, y: -42
					}
				});

				this.__root.add(this.__entities.points);

				this.__root.add(new lychee.ui.Button({
					label: 'Time:',
					font:  this.game.fonts.normal,
					position: {
						x: 0, y: 42
					}
				}));

				this.__entities.time = new lychee.ui.Button({
					label: '0',
					font:  this.game.fonts.normal,
					position: {
						x: 0, y: 84
					}
				});

				this.__root.add(this.__entities.time);

			} else {

				this.__root.width  = data.width;
				this.__root.height = data.height;
				this.__root.setPosition(data.position);

			}


			this.__background = [];


			var sizeX = Math.round(data.width / data.tile);
			var sizeY = Math.round(data.height / data.tile);

			var state = 'default';

			for (var x = 0; x <= sizeX; x++) {
				for (var y = 0; y <= sizeY; y++) {

					if (x % 2 === 0) {
						state = 'sand-c';
					} else {
						state = 'sand-d';
					}

					if (x % 2 === 0 && y % 2 === 0) {
						state = 'sand-a';
					} else if (y % 2 === 0) {
						state = 'sand-b';
					}

					var entity = new game.entity.Deco({
						image: this.game.config.deco.image,
						states: this.game.config.deco.states,
						state: state,
						map: this.game.config.deco.map,
						position: {
							x: x * data.tile + data.position.x - data.width / 2,
							y: y * data.tile + data.position.y - data.height / 2
						}
					});

					this.__background.push(entity);

				}
			}

		},

		enter: function() {

			this.score.bind('update', this.__updateScore, this);
			this.score.set('time', this.game.settings.play.time);
			this.score.set('points', 0);

		},

		leave: function() {
			this.score.unbind('update', this.__updateScore);
		},

		update: function(clock, delta) {
		},

		render: function(clock, delta) {

			for (var b = 0, bl = this.__background.length; b < bl; b++) {
				this.__renderer.renderDeco(this.__background[b]);
			}


			if (this.__root !== null) {
				this.__renderer.renderUIArea(this.__root);
			}

		},


		/*
		 * PRIVATE API
		 */

		__updateScore: function(data) {

			this.__entities.points.setLabel(data.points + '');

			var time = (data.time / 1000) | 0;
			this.__entities.time.setLabel(time + '');

		}

	};


	return Class;

});

