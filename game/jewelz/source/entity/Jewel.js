
lychee.define('game.entity.Jewel').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, global, attachments) {

	var _image  = attachments["png"];
	var _config = attachments["json"];


	var Class = function(settings) {

		this.__lastStateId = null;


		settings.image  = _image;
		settings.states = _config.states;
		settings.map    = _config.map;

		lychee.game.Sprite.call(this, settings);

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		getRandomState: function() {

			if (this.__lastStateId === null) {

				this.__lastStateId = 0;

				for (var id in this.__states) {
					if (this.__states[id] > this.__lastStateId) {
						this.__lastStateId = this.__states[id];
					}
				}

			}


			var rand = Math.random() * this.__lastStateId | 0;
			var found = "default";

			for (var id in this.__states) {
				if (this.__states[id] === rand) {
					found = id;
				}
			}


			return found;

		}

	};


	return Class;

});

