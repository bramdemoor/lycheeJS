
lychee.define('game.Server').requires([
	'lychee.game.Loop',
	'lychee.net.Server'
]).exports(function(lychee, global) {

	var Class = function() {

		this.loop = new lychee.game.Loop({
			render: 60,
			update: 60
		});


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

		__onReceive: function(data) {

			if (typeof drone === 'undefined') return false;


			var method = data.method;
			var value  = data.value;


			drone.disableEmergency();

			switch(method) {

				case 'takeoff':
					drone.takeoff();
				break;

				case 'land':
					drone.land();
				break;

				case 'up':

					this.loop.timeout(0, function() {

						drone.up(value);

						this.loop.timeout(2000, function() {
							drone.stop();
						}, this);

					}, this);

				break;

				case 'down':

					this.loop.timeout(0, function() {

						drone.down(value);

						this.loop.timeout(2000, function() {
							drone.stop();
						}, this);

					}, this);

				break;

				case 'barrelroll':

					// drone.animate('flipLeft', value);
					drone.animate('flipLeft', 1000);

				break;

			}

console.log('SERVER RECEIVED DATA', data);

		}

	};


	return Class;

});

