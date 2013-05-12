
lychee.define('game.ui.Navigation').requires([
	'lychee.ui.Area',
	'lychee.ui.Button'
]).includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(game, settings) {

		this.game = game;


		lychee.ui.Area.call(this, settings);


		var links = [{
			label: 'Scene',
			callback: function() {
				this.game.setState('scene');
			}
		}, {
			label: 'Translation',
			callback: function() {
				this.game.setState('translation');
			}
		}, {
			label: 'Font',
			callback: function() {
				this.game.setState('font');
			}
		}];


		var font = this.game.fonts.normal;

		for (var l = 0, ll = links.length; l < ll; l++) {

			var link = links[l];

			var entity = new lychee.ui.Button({
				label: link.label,
				font:  font,
				position: {
					x: l * 100,
					y: 32
				}
			});


			entity.bind('touch', link.callback, this);


			console.log(entity);

		}


	};


	Class.prototype = {

	};


	return Class;

});

