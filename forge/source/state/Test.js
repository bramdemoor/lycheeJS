
lychee.define('game.state.Test').requires([
	'lychee.ui.Input',
	'lychee.ui.Slider',
	'lychee.ui.Textarea'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.game.State.call(this, game, 'test');

		this.__locked = false;

		this.reset();

	};


	Class.prototype = {

		reset: function() {

			var layer = new lychee.game.Layer();

			layer.addEntity(new lychee.ui.Slider({
				range: {
					from:  0,
					to:    100,
					delta: 1
				},
				radius: 100,
				position: {
					x: 200,
					y: 200
				},
				value: 0
			}));

			layer.addEntity(new lychee.ui.Slider({
				range: {
					from:  0,
					to:    360,
					delta: 10
				},
				radius: 50,
				position: {
					x: 500,
					y: 200
				},
				value: 90
			}));

			layer.addEntity(new lychee.ui.Slider({
				range: {
					from:  0,
					to:    360,
					delta: 10
				},
				radius: 50,
				position: {
					x: 650,
					y: 200
				},
				value: 180
			}));

			layer.addEntity(new lychee.ui.Textarea({
				font:   this.game.fonts.normal,
				value:  ':)',
				width:  200,
				height: 100,
				position: {
					x: 850,
					y: 200
				}
			}));

			layer.addEntity(new lychee.ui.Input({
				font: this.game.fonts.normal,
				type: lychee.ui.Input.TYPE.text,
				value: 'test',
				width: 200,
				position: {
					x: 850,
					y: 300
				}
			}));

			layer.addEntity(new lychee.ui.Input({
				font: this.game.fonts.normal,
				type: lychee.ui.Input.TYPE.number,
				value: 12345,
				min: 123,
				max: 12347,
				width: 200,
				position: {
					x: 550,
					y: 300
				}
			}));


			this.addLayer('ui', layer);

		},

		enter: function() {

			lychee.game.State.prototype.enter.call(this);


/*
			this.__loop.interval(25, function(clock, delta) {

				var slider1 = this.__entities.slider1;
				var slider2 = this.__entities.slider2;

				var value1 = slider1.getValue() + 1;
				var value2 = slider2.getValue() + 1;

				slider1.setValue(value1);
				slider2.setValue(value2);

			}, this);
*/

		},

		leave: function() {

			lychee.game.State.prototype.leave.call(this);

		}

	};


	return Class;

});
