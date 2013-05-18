
lychee.define('game.entity.Deco').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, global, attachments) {

	var _image  = attachments["png"];
	var _config = attachments["json"];


	var Class = function(settings) {

		settings.image  = _image;
		settings.states = _config.states;
		settings.map    = _config.map;

		lychee.game.Sprite.call(this, settings);

	};


	Class.prototype = {
	};


	return Class;

});

