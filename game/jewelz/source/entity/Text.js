
lychee.define('game.entity.Text').includes([
	'lychee.game.Entity'
]).exports(function(lychee, global) {

	var Class = function(settings) {

		this.text = settings.text || '';
		this.font = settings.font || null;


		delete settings.text;
		delete settings.font;


		lychee.game.Entity.call(this, settings);

	};


	Class.prototype = {

		setText: function(text) {

			if (typeof text === 'string') {

				this.text = text;

				return true;

			}


			return false;

		}

	};


	return Class;

});

