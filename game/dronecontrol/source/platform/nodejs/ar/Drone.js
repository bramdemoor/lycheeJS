
lychee.define('game.ar.Drone').requires([
	'game.ar.command.CONFIG',
	'game.ar.command.PCMD',
	'game.ar.command.REF',
	'game.ar.command.Socket',
	'game.ar.navdata.Socket'
//	'game.ar.video.Socket'
]).exports(function(lychee, global) {

	var _config = game.ar.command.CONFIG;
	var _pcmd   = game.ar.command.PCMD;
	var _ref    = game.ar.command.REF;
	var _commandsocket = game.ar.command.Socket;
	var _navdatasocket = game.ar.navdata.Socket;


	var Class = function(data) {

		var settings = lychee.extend({
			ip:   '192.168.1.1'
		}, data);


		this.__ref          = new _ref(false, false);
		this.__pcmd         = new _pcmd(0, 0, 0, 0);
		this.__config       = new _config();
		this.__flightconfig = new _config();


		var ip = settings.ip;

		this.__commandSocket = new _commandsocket(ip);
		this.__navdataSocket = new _navdatasocket(ip);
		this.__navdataSocket.bind('receive', this.__processNavdata, this);

		//this.__videoSocket   = new _videosocket(
		// settings.ip, 5555
		//);

		this.__isFlying         = false;
		this.__isInEmergency    = false;
		this.__disableEmergency = false;

		this.__navdata = null;

		this.__state = {};
		this.__state.roll  = 0;
		this.__state.pitch = 0;
		this.__state.yaw   = 0;
		this.__state.heave = 0;
		this.__state.config = {
			'general:navdata_demo': 'TRUE'
		};


		this.__flightanimation = {};
		this.__flightanimation.active   = false;
		this.__flightanimation.type     = null;
		this.__flightanimation.start    = null;
		this.__flightanimation.duration = null;
		this.__flightanimation.sent     = false;

		this.__clock = null;


		settings = null;

	};


	Class.FLIGHTANIMATION = {
		'turnaround':       0,
		'turnaroundGodown': 1,
		'yawShake':         2,
		'yawDance':         3,
		'phiDance':         4,
		'thetaDance':       5,
		'wave':             6
	};


	Class.LEDANIMATION = {
		'blinkGreenRed': 0,
		'blinkGreen':    1,
		'blinkRed':      2.
		'blinkOrange':   3,
		'fire':          4,
		'standard':      5,
		'red':           6,
		'green':         7,
		'blank':         8
	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__processNavdata: function(data) {

			if (data instanceof Object) {

				if (
					data.state
					&& data.states.emergency_landing === true
					&& this.__disableEmergency === true
				) {
					this.__ref.setEmergency(true);
				} else {
					this.__ref.setEmergency(false);
					this.__disableEmergency = false;
				}


				this.__navdata = data;

			}

		},

		isFlying: function() {
			return this.__isFlying === true;
		},

		isLanding: function() {
			return this.__isFlying === false;
		},

		disableEmergency: function() {
			this.__disableEmergency = true;
		},

		update: function(clock, delta) {

			if (this.__commandSocket !== null) {

				var state = this.__state;
				for (var id in state.config) {

console.log('SENDING CONFIG', id, state.config[id]);

					this.__config.set(id, state.config[id]);
					this.__commandSocket.add(this.__config);

				}

				for (var id in state.config) {
					delete state.config[id];
				}



				this.__commandSocket.add(this.__ref);

				this.__pcmd.set(
					state.roll,
					state.pitch,
					state.yaw,
					state.heave
				);

				this.__commandSocket.add(this.__pcmd);

/*
				var flightani = this.__flightanimation;
				if (flightani.active === true) {

					if (flightani.sent === false) {

						this.__flightconfig.set(
							'control:flight_anim',
						);


						flightani.sent = true;

					} else if (flightani.start + flightani.duration > clock) {
						flightani.active = false;
					}

				}
*/

				this.__commandSocket.flush();

			}


			this.__clock = clock;

		},



		/*
		 * INTERACTION API
		 */

		takeoff: function() {
			this.__isFlying = true;
			this.__ref.setFlying(this.__isFlying);
		},

		land: function() {
			this.__isFlying = false;
			this.__ref.setFlying(this.__isFlying);
		},

		stop: function() {

			var state = this.__state;

			state.roll  = 0;
			state.pitch = 0;
			state.yaw   = 0;
			state.heave = 0;

		},

		roll: function(speed) {
			// TODO: Implement Roll
		},

		pitch: function(speed) {
			// TODO: Implement Pitch
		},

		yaw: function(speed) {

			if (
				typeof speed === 'number'
				&& speed >= -1.0
				&& speed <=  1.0
			) {
				this.__state.yaw = speed;
				return true;
			}


			return false;

		},

		heave: function(speed) {

			if (
				typeof speed === 'number'
				&& speed >= -1.0
				&& speed <=  1.0
			) {
				this.__state.heave = speed;
				return true;
			}


			return false;

		},

		animateFlight: function(type, duration) {

			duration = typeof duration === 'number' ? duration : null;


			var valid = false;

			for (var id in Class.FLIGHTANIMATION) {
				if (id === type) {
					valid = true;
					break;
				}
			}


			if (
				valid === true
				&& duration !== null
			) {
				this.__state.config['control:flight_anim'] = type + ',' + duration;
				return true;
			}


			return false;

		},

		animateLEDS: function(type, duration) {

			duration = typeof duration === 'number' ? duration : null;


			var valid = false;

			for (var id in Class.LEDANIMATION) {
				if (id === type) {
					valid = true;
					break;
				}
			}


			if (
				valid === true
				&& duration !== null
			) {
				this.__state.config['control:leds_anim'] = type + ',' + duration;
				return true;
			}


			return false;

		}

	};


	return Class;

});

