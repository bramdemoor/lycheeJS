
lychee.define('game.state.Result').requires([
	'game.entity.Text'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.game.State.call(this, game, 'result');


		this.__entities = {};

		this.reset();

	};


	Class.prototype = {

		reset: function() {

			var entity = null;
			var width  = this.game.settings.width;
			var height = this.game.settings.height;


			this.removeLayer('ui');


			var layer = new lychee.game.Layer();


			entity = new lychee.ui.Button({
				text: 'Game Over',
				font: this.game.fonts.normal,
				position: {
					x: 0,
					y: -1/2 * height - 42
				}
			});

			layer.addEntity(entity);
			this.__entities.headline = entity;


			entity = new lychee.ui.Button({
				text: '0 Points',
				font: this.game.fonts.normal,
				position: {
					x: 0,
					y: 1/2 * height + 50
				}
			});

			layer.addEntity(entity);
			this.__entities.points = entity;


			entity = new lychee.ui.Button({
				text: 'Touch to get back to Menu',
				font: this.game.fonts.small,
				position: {
					x: 0,
					y: 1/2 * height - 24
				}
			});

			layer.addEntity(entity);
			this.__entities.hint = entity;


			this.addLayer('ui', layer);

		},

		enter: function(data) {

			if (data instanceof Object) {
				data.points = typeof data.points === 'number' ? data.points : 0;
			}


			lychee.game.State.prototype.enter.call(this);

return;

			this.__locked = true;


			var hwidth = this.game.settings.width / 2;
			var hheight = this.game.settings.height / 2;


			this.__entities.headline.setPosition({
				y: -hheight - 60
			});

			this.__entities.points.setText(data.points + ' Points');
			this.__entities.points.setPosition({
				y: hheight + 50
			});

			this.__entities.hint.setPosition({
				y: hheight + 50
			});


			this.__loop.timeout(500, function() {

				this.__entities.headline.setTween(2000, {
					y: -60
				}, lychee.game.Entity.TWEEN.bounceEaseOut);

	   			this.__entities.points.setTween(2000, {
					y: 0
				}, lychee.game.Entity.TWEEN.bounceEaseOut);

			}, this);


			this.__loop.timeout(3000, function() {

				this.__entities.hint.setTween(500, {
					y: hheight - 20
				}, lychee.game.Entity.TWEEN.easeOut);

				this.__locked = false;

			}, this);

		},

		leave: function() {

			lychee.game.State.prototype.leave.call(this);

		},

		__processTouch: function(position, delta) {

			if (this.__locked === true) return;
			this.game.setState('menu');

		}

	};


	return Class;

});

