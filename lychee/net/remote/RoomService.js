
lychee.define('lychee.net.remote.RoomService').exports(function(lychee, global) {

	var Class = function(remote) {

		this.remote = remote;

	};


	Class.prototype = {

		getId: function() {
			return 'RoomService';
		},



		/*
		 * COMMANDS
		 */

		enter: function(data) {

			var response = {
				foo: 'bar'
			};


			this.remote.send(response, {
				id:     this.getId(),
				method: 'update'
			});

		}

	};


	return Class;

});

