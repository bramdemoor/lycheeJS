
lychee.define('lychee.net.client.RoomService').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global) {

	var Class = function(client) {

		this.client = client;

		lychee.event.Emitter.call(this, 'roomservice');

	};


	Class.prototype = {

		getId: function() {
			return 'RoomService';
		},

		init: function() {
			this.trigger('ready');
		},



		/*
		 * COMMANDS
		 */

		enter: function() {

			this.client.send({}, {
				id:     this.getId(),
				method: 'enter'
			});

		}

	};


	return Class;

});

