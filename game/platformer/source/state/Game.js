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

            this.__input.bind('key', this.__processKey, this);

			this.__renderer.start();
		},

		leave: function() {

			this.__renderer.stop();

			this.__input.unbind('key', this.__processKey);

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

        __processKey: function(key, name, delta) {
            if(key == 'up') {
                this.__entities.player.jump();
            } else if (key == 'left') {
                this.__entities.player.moveLeft();
            } else if (key == 'right') {
                this.__entities.player.moveRight();
            } else if (key == 'down') {
                this.__entities.player.moveDown();
            }  else if (key == 'space') {
                this.__entities.player.action();
            } else if (key == 'q') {
                this.game.setState('menu');
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
