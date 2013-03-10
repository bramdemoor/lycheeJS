
lychee.define('lychee.net.client.RoomService').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global) {

	var Class = function() {

		lychee.event.Emitter.call(this, 'roomservice');

	};


	Class.prototype = {

		getId: function() {
			return 'RoomService';
		},

		init: function() {
			this.trigger('ready');
		}

	};


	return Class;

});

