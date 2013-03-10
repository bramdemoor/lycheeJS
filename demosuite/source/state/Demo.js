
lychee.define('game.state.Demo').includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.game.State.call(this, game, 'menu');

		this.__input = this.game.input;
		this.__loop = this.game.loop;
		this.__renderer = this.game.renderer;

		this.__backbutton = null;
		this.__demo = null;
		this.__locked = false;

		this.reset();

	};


	Class.prototype = {

		reset: function() {

			var entity;


			var width = this.game.settings.width;
			var height = this.game.settings.height;


			entity = new lychee.ui.Button({
				label: '< Back',
				font: this.game.fonts.normal,
				position: {
					x: 64,
					y: height - 24
				}
			});

			this.__backbutton = entity;

		},

		enter: function(id) {

			lychee.game.State.prototype.enter.call(this);


			var valid = false;

			var construct = game.demo[id];
			if (typeof construct === 'function') {
				this.__demo = new construct(this.game);
				valid = true;
			}


			this.__input.bind('touch', this.__processTouch, this);
			this.__renderer.start();


			if (valid === false) {
				this.__loop.timeout(0, function() {
					this.game.setState('menu');
				}, this);
			}

		},

		leave: function() {

			this.__renderer.stop();
			this.__input.unbind('touch', this.__processTouch);

			this.__demo = null;

			lychee.game.State.prototype.leave.call(this);

		},

		update: function(clock, delta) {

			if (this.__demo !== null) {
				this.__demo.update(clock, delta);
			}

		},

		render: function(clock, delta) {

			this.__renderer.clear();

			if (this.__demo !== null) {
				this.__demo.render(clock, delta);
			}

			this.__renderer.renderUIButton(this.__backbutton);

			this.__renderer.flush();

		},

		__processTouch: function(id, position, delta) {

			if (this.__locked === true) return;

			var offset = this.game.getOffset();

			position.x -= offset.x;
			position.y -= offset.y;


			if (this.__backbutton !== null) {

				var pos    = this.__backbutton.getPosition();
				var width  = this.__backbutton.width;
				var height = this.__backbutton.height;

				var x1 = pos.x - width / 2;
				var x2 = pos.x + width / 2;
				var y1 = pos.y - height / 2;
				var y2 = pos.y + height / 2;

				if (
					position.x > x1
					&& position.x < x2
					&& position.y > y1
					&& position.y < y2
				) {
					this.game.setState('menu');
				} else {

					if (this.__demo !== null) {
						this.__demo.touch(position.x, position.y);
					}

				}

			}

		}

	};


	return Class;

});
