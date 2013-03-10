
lychee.define('game.state.Editor').requires([

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

			this.__locked = true;


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


			for (var e in this.__entities) {
				if (this.__entities[e] === null) continue;
				this.__renderer.renderText(this.__entities[e]);
			}


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
