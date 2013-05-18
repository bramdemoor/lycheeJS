lychee.define('game.state.Game')
    .requires(['game.entity.Character'])
    .includes(['lychee.game.State']).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.game.State.call(this, game, 'menu');

		this.__input = this.game.input;
		this.__loop = this.game.loop;
		this.__renderer = this.game.renderer;

		this.__clock = 0;
		this.__entities = {};
		this.__locked = false;

		this.reset();
	};

	Class.prototype = {

		reset: function() {

			var width = this.game.settings.width;
			var height = this.game.settings.height;

            this.__entities.player = new game.entity.Character(this.game.images.character);
		},

		enter: function() {
			lychee.game.State.prototype.enter.call(this);

			this.__locked = true;

			this.__input.bind('touch', this.__processTouch, this);
			this.__renderer.start();
		},

		leave: function() {

			this.__renderer.stop();
			this.__input.unbind('touch', this.__processTouch);

			lychee.game.State.prototype.leave.call(this);
		},

		update: function(clock, delta) {

            this.__entities.player.updateCustom();

			for (var e in this.__entities) {
				if (this.__entities[e] === null) continue;
				this.__entities[e].update(clock, delta);
			}

			this.__clock = clock;
		},

		render: function(clock, delta) {
			this.__renderer.clear();

			for (var e in this.__entities) {
				if (this.__entities[e] === null) continue;
				this.__renderer.renderCharacter(this.__entities[e]);
			}

			this.__renderer.flush();
		},

		__processTouch: function(id, position, delta) {
			if (this.__locked === true) return;

			var offset = this.game.getOffset();

			position.x -= offset.x;
			position.y -= offset.y;

			var entity = this.__getEntityByPosition(position.x, position.y);
			if (entity === this.__entities.exithint) {
				this.game.setState('menu');
			}

			if (this.game.settings.sound === true) {
				this.game.jukebox.play('click');
			}
		},

		__getEntityByPosition: function(x, y) {
			var found = null;
			for (var e in this.__entities) {

				if (this.__entities[e] === null) continue;

				var entity = this.__entities[e];
				var position = entity.getPosition();

				if (
					x >= position.x - entity.width / 2
					&& x <= position.x + entity.width / 2
					&& y >= position.y - entity.height / 2
					&& y <= position.y + entity.height / 2
				) {
					found = entity;
					break;
				}
			}

			return found;
		}

	};

	return Class;
});