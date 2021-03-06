lychee.define('game.state.Game')
    .requires([
        'game.entity.Character',
        'game.scene.GameLevel',
        'game.entity.Bullet',
        'game.entity.Powerup'
    ])
    .includes([
        'lychee.game.State',
        'lychee.event.Emitter'
    ]).exports(function(lychee, global) {

	var Class = function(game) {

        this.myBus = new lychee.event.Emitter('MainGameBus');

        lychee.game.State.call(this, game, 'menu');

		this.__input = this.game.input;
		this.__loop = this.game.loop;
		this.__renderer = this.game.renderer;

		this.__clock = 0;

		this.__entities = {
            bullets: [],
            powerups: []
        };

		this.__locked = false;

        this.__score = 0;

		this.reset();
	};

	Class.prototype = {

		reset: function() {

			var width = this.game.settings.width;
			var height = this.game.settings.height;

            this.__level = new game.scene.GameLevel(this.game, this.game.settings.game);
            this.__entities.player = new game.entity.Character(this.game.config.character, this.game.fonts.small);
            this.__entities.powerups.push(new game.entity.Powerup(this.game.config.powerup));
		},

		enter: function() {
			lychee.game.State.prototype.enter.call(this);

            this.__level.enter();

			this.__locked = true;

            this.__input.bind('key', this.__processKey, this);

			this.__renderer.start();

            this.myBus.bind('PlayerHitByBullet', this.onHitByBullet);
		},

        onHitByBullet: function() {
            console.log('the player was hit by a bullet!');
        },

		leave: function() {

            this.__level.leave();

			this.__renderer.stop();

			this.__input.unbind('key', this.__processKey);

            this.myBus.unbind('PlayerHitByBullet', this.onHitByBullet);

			lychee.game.State.prototype.leave.call(this);
		},

		update: function(clock, delta) {

            this.__level.update(clock, delta);

            var tileX = ((this.__entities.player.getPos().x  / 32) | 0);
            var tileY = ((this.__entities.player.getPos().y  / 32) | 0);

            var canMoveLeft = tileX > 0;
            var canMoveRight = tileX < 20;
            var canMoveDown = tileY < 20;

            this.__entities.player.updateCustom(canMoveLeft, canMoveRight, canMoveDown);
            this.__entities.player.update(clock, delta);

            var s = this;
            this.__entities.bullets.forEach(function(element, index, array) {
                if (element.collidesWith(s.__entities.player)) {
                    s.myBus.trigger('PlayerHitByBullet', [ 'MainGameBus', { bar: null }]);
                }
                element.update(clock, delta);
            });
            this.__entities.powerups.forEach(function(element, index, array) {
                if (element.collidesWith(s.__entities.player)) {
                    element.setState('destroy');
                    s.__entities.powerups.splice(index);
                    console.log('powerup picked up');
                }
            });

			this.__clock = clock;
		},

		render: function(clock, delta) {
			this.__renderer.clear();

            this.__level.render(clock, delta);

            this.__renderer.renderCharacter(this.__entities.player);

            var s = this;
            this.__entities.bullets.forEach(function(element, index, array) {
                s.__renderer.renderEntity(element);
            });
            this.__entities.powerups.forEach(function(element, index, array) {
                s.__renderer.renderEntity(element);
            });

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
                this.__entities.bullets.push(new game.entity.Bullet(this.game.config.shot, this.__entities.player.getPos().x, this.__entities.player.getPos().y, this.__entities.player.getDir()));
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
