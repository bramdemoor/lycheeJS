
lychee.define('game.state.Test').requires([
	'lychee.ui.Slider'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.game.State.call(this, game, 'menu');

		this.__input = this.game.input;
		this.__loop = this.game.loop;
		this.__renderer = this.game.renderer;

		this.__clock = 0;
		this.__entities = {};
		this.__locked = false;

		this.reset();

	};


	Class.prototype = {

		reset: function() {

		},

		enter: function() {

			lychee.game.State.prototype.enter.call(this);


			this.__entities.slider1 = new lychee.ui.Slider({
				range: {
					from:  0,
					to:    100,
					delta: 1
				},
				radius: 100,
				position: {
					x: 200,
					y: 200
				}
			});

			this.__entities.slider1.setValue(20);


			this.__entities.slider2 = new lychee.ui.Slider({
				range: {
					from:  0,
					to:    360,
					delta: 10
				},
				radius: 50,
				position: {
					x: 500,
					y: 200
				}
			});

			this.__entities.slider2.setValue(90);


			this.__entities.slider3 = new lychee.ui.Slider({
				range: {
					from:  0,
					to:    360,
					delta: 10
				},
				radius: 50,
				position: {
					x: 800,
					y: 200
				}
			});

			this.__entities.slider3.setValue(90);



			this.__loop.interval(25, function(clock, delta) {

				var slider1 = this.__entities.slider1;
				var slider2 = this.__entities.slider2;

				var value1 = slider1.getValue() + 1;
				var value2 = slider2.getValue() + 1;

				slider1.setValue(value1);
				slider2.setValue(value2);

			}, this);

global.SLIDER = this.__entities.slider;


			this.__input.bind('touch', this.__processTouch, this);
			this.__renderer.start();

		},

		leave: function() {

			this.__renderer.stop();
			this.__input.unbind('touch', this.__processTouch);


			lychee.game.State.prototype.leave.call(this);

		},

		update: function(clock, delta) {

			for (var e in this.__entities) {
				if (this.__entities[e] === null) continue;
				this.__entities[e].update(clock, delta);
			}

			this.__clock = clock;

		},

		render: function(clock, delta) {

			this.__renderer.clear();


			this.__renderer.renderUISlider(this.__entities.slider1);
			this.__renderer.renderUISlider(this.__entities.slider2);
			this.__renderer.renderUISlider(this.__entities.slider3);


			this.__renderer.flush();

		},

		__processTouch: function(id, position, delta) {

			if (this.__locked === true) return;

			var offset = this.game.getOffset();

			position.x -= offset.x;
			position.y -= offset.y;


		}

	};


	return Class;

});
