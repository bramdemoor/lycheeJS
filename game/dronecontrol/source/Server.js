
lychee.define('game.Server').requires([
	'game.ar.Drone',
	'lychee.game.Loop',
	'lychee.net.Server'
]).exports(function(lychee, global) {

	var _drone = game.ar.Drone;

	var Class = function(drone) {

		this.drone = drone instanceof _drone ? drone : null;

		this.loop = new lychee.game.Loop({
			render: 0,
			update: 33
		});

		this.loop.bind('update', this.update, this);


		this.server = new lychee.net.Server(
			JSON.stringify, JSON.parse
		);

		this.server.listen(
			1338,
			null
		);

		this.server.bind('connect', function(remote) {

			remote.accept();

			remote.bind('receive', this.__onReceive, this);

		}, this);


	};


	Class.prototype = {

		/*
		 * STATE API
		 */

		update: function(clock, delta) {

			if (this.drone !== null) {
				this.drone.update();
			}

		},

		__onReceive: function(data) {

			if (this.drone === null) {
				return false;
			}


			var method = data.method;
			var type   = data.type || null;
			var value  = data.value;


			// this.drone.setEmergency(false);


			switch(method) {

				case 'takeoff':
					this.drone.takeoff();
				break;

				case 'land':
					this.drone.land();
				break;

				case 'stop':
					this.drone.stop();
				break;

				case 'roll':
					this.drone.roll(value);
				break;
				case 'pitch':
					this.drone.pitch(value);
				break;
				case 'yaw':
					this.drone.yaw(value);
				break;
				case 'heave':
					this.drone.heave(value);
				break;

				case 'animateFlight':
					this.drone.animateFlight(type, value);
				break;

			}

console.log('SERVER RECEIVED DATA', data);

		}

	};


	return Class;

});

