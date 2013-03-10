
lychee.define('game.scene.Overlay').exports(function(lychee, global) {

	var Class = function(game, settings) {

		this.game = game;

		this.__loop     = game.loop;
		this.__root     = null;
		this.__visible  = true;
		this.__renderer = game.renderer;


		this.reset(settings);

	};


	Class.prototype = {

		reset: function(data) {

			if (this.__root === null) {

				this.__root = new lychee.ui.Area({
					width:  data.width,
					height: data.height,
					position: {
						x: data.position.x,
						y: data.position.y
					}
				});

				this.__intro = new lychee.ui.Button({
					label: '3',
					font:  this.game.fonts.headline,
					position: {
						x: 0, y: 0
					}
				});

				this.__root.add(this.__intro);

			} else {

				this.__root.width  = data.width;
				this.__root.height = data.height;
				this.__root.setPosition(data.position);

			}

		},

		enter: function() {

			if (this.game.settings.sound === true) {
				this.game.jukebox.play('countdown');
			}


			this.__visible = true;

			this.__loop.timeout(0, function(clock, delta) {
				this.__intro.setLabel('3');
			}, this);

			this.__loop.timeout(1000, function() {
				this.__intro.setLabel('2');
			}, this);

			this.__loop.timeout(2000, function() {
				this.__intro.setLabel('1');
			}, this);

			this.__loop.timeout(3000, function() {
				this.__intro.setLabel('Go!');
			}, this);

			this.__loop.timeout(4000, function() {
				this.__visible = false;
			}, this);

		},

		leave: function() {

		},

		update: function(clock, delta) {

			if (this.__root !== null) {
				this.__root.update(clock, delta);
			}

		},

		render: function() {

			if (this.__visible === true && this.__root !== null) {
				this.__renderer.renderUIArea(this.__root);
			}

		},

		isVisible: function() {
			return this.__visible === true;
		}

	};


	return Class;

});

