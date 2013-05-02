
lychee.define('game.state.Game').includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.game.State.call(this, game, 'menu');

		this.__camera   = this.game.camera;
		this.__input    = this.game.input;
		this.__loop     = this.game.loop;
		this.__renderer = this.game.renderer;

		this.__autopilot   = false;
		this.__clock       = 0;
		this.__timeout     = 0;

		this.__direction   = 1;
		this.__players     = null;
		this.__track       = null;
		this.__lastSegment = null;
		this.__locked      = false;

		this.reset();

	};


	Class.prototype = {

		reset: function() {

		},

		enter: function() {

			lychee.game.State.prototype.enter.call(this);

			this.__autopilot   = false;
			this.__timeout     = (Math.random() * 10000) | 0;
			this.__track       = this.game.getTrack();
			this.__players     = this.game.getPlayers();
			this.__lastSegment = null;
			this.__locked      = true;
			this.__localPlayer = this.game.getPlayer('local');


			var wait = 3; // in seconds

			this.__camera.getPosition().y = this.__camera.getOffset() + wait * 10 * this.game.settings.height;


			for (var p = 0, pl = this.__players.length; p < pl; p++) {

				var ship = this.__players[p].getShip();
				if (ship !== null) {
					ship.reset();
				}

			}


			var start = null;

			var handle = this.__loop.interval(1000 / 60, function(clock, delta, step) {

				if (start === null) {
					start = clock;
				}

				var t = (clock - start) / (wait * 1000);

				// Tween camera position from sky to track
				var position = this.__camera.getPosition();
				var offset   = this.__camera.getOffset();


				var y = offset + (1 - (Math.pow(t - 1, 3) + 1)) * wait * 10 * this.game.settings.height;

				position.y = y;


				for (var p = 0, pl = this.__players.length; p < pl; p++) {

					var ship = this.__players[p].getShip();
					if (ship !== null) {
						ship.getPosition().z = this.game.settings.distance * t;
					}

				}


				if (y < offset) {

					position.y = offset;
					handle.clear();

					this.__locked = false;

					if (this.__localPlayer !== null) {
						this.__camera.follow(this.__localPlayer.getShip(), this.game.settings.distance);
					}

				}

			}, this);


			this.__input.bind('key',   this.__processKey, this);
			this.__input.bind('touch', this.__processTouch, this);
			this.__renderer.start();

		},

		leave: function() {

			this.__renderer.stop();
			this.__input.unbind('touch', this.__processTouch);
			this.__input.unbind('key',   this.__processKey);

			this.__autopilot   = false;
			this.__timeout     = 0;
			this.__track       = null;
			this.__players     = null;
			this.__lastSegment = null;
			this.__locked      = true;


			lychee.game.State.prototype.leave.call(this);

		},

		update: function(clock, delta) {

			if (
				this.__autopilot === true
				&& this.__localPlayer !== null
				&& this.__clock > this.__timeout
			) {

				var ship = this.__localPlayer.getShip();
				ship.accelerate();

				this.__timeout = this.__clock + 200;

			}


			var segments = this.__track.getSegments();
			var slength  = this.__track.getLength(true);
			var length   = this.__track.getLength(false);


			for (var p = 0, pl = this.__players.length; p < pl; p++) {

				var ship = this.__players[p].getShip();
				if (ship !== null) {

					ship.update(clock, delta);

					var position = ship.getPosition();
					var z = ((position.z / 200) | 0) % slength;
					var current = segments[z];
					var next    = segments[(z + 1) % slength];

					position.y  = current.from.y;
					position.z %= length;



					// TODO: Remove this auto pilot stuff :)
					var diff = next.curviness - current.curviness;
					if (diff > 0) {
						ship.setRotation(12);
					} else if (diff < 0) {
						ship.setRotation(-12);
					} else {
						ship.setRotation(0);
					}


					// FIXME: This is a really bad projection hack.
					// Have no idea how to fix that correctly. If
					// a player decelerates at the start, the position
					// gets to negative values for the camera as the
					// camera follows in 800z distance.
					if (ship.getSpeed() < 0 && position.z < this.game.settings.distance) {
						ship.stop();
						position.z = this.game.settings.distance + 1;
					}

				}

			}


			this.__camera.update(clock, delta);

			this.__clock = clock;

		},

		render: function(clock, delta) {

			this.__renderer.clear();

			if (this.__track !== null) {

				var camera      = this.__camera;
				var length      = this.__track.getLength();
				var bgimage     = this.__track.getWorld().getImage();
				var backgrounds = this.__track.getWorld().getBackgrounds();
				var segments    = this.__track.getSegments();


				if (bgimage !== null) {
					this.__renderer.renderBackgrounds(bgimage, backgrounds, camera);
				}

				this.__renderer.renderSegments(segments, camera, length);


				var shipimage = this.game.images.ships;

				for (var p = 0, pl = this.__players.length; p < pl; p++) {

					var ship   = this.__players[p].getShip();
					if (ship !== null) {
						this.__renderer.renderShip(shipimage, ship, camera, length);
					}

				}

			}

			this.__renderer.flush();

		},

		__processKey: function(key, name, delta) {

			if (this.__locked === true) return;


			if (this.__localPlayer !== null) {

				var ship     = this.__localPlayer.getShip();
				var controls = this.game.settings.controls;

				if (key === controls[0]) ship.accelerate();
				if (key === controls[1]) ship.decelerate();
				if (key === controls[2]) ship.steerLeft();
				if (key === controls[3]) ship.steerRight();
				if (key === 'backspace') {
					this.__autopilot = true;
					this.__timeout = this.__clock + Math.random() * 5000;
				}

			}

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
