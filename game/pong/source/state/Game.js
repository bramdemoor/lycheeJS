
lychee.define('game.state.Game').requires([
	'game.entity.Ball',
	'game.entity.Paddle'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.game.State.call(this, game, 'menu');

		this.__clock    = 0;
		this.__entities = {};
		this.__locked   = false;

		this.__score = {
			cpu: 0,
			player: 0
		};

		// required for AI logic
		this.__ai = {
			clock: null,
			delta: 500, // lower = smarter
			position: {
				y: 0
			}
		};

		// required for Player logic
		this.__target = { y: 0 };

		this.reset();

	};


	Class.prototype = {

		reset: function() {

			this.__entities.ball   = new game.entity.Ball();
			this.__entities.player = new game.entity.Paddle('player');
			this.__entities.cpu    = new game.entity.Paddle('cpu');

		},

		// this method will reset the game board each round
		__reset: function(winner) {

			winner = typeof winner === 'string' ? winner : null;

			var width  = this.game.settings.width;
			var height = this.game.settings.height;


			this.__entities.ball.setPosition({
				x: width / 2,
				y: height / 2
			});


			var v = { x: 150 + Math.random() * 100, y: Math.random() * 100 };

			if (Math.random() > 0.5) { v.y *= -1; }
			if (
				winner === 'player'
				|| (winner === null && Math.random() > 0.5)
			) {
				v.x *= -1;
			}

			this.__entities.ball.setVelocity(v);

			this.__entities.player.setPosition({
				x: 20,
				y: height / 2
			});

			this.__entities.cpu.setPosition({
				x: width - 20,
				y: height / 2
			});

			this.__target.y = height / 2;
			this.__ai.position.y = height / 2;

		},

		enter: function() {

			this.__score.cpu = 0;
			this.__score.player = 0;
			this.__reset();

			lychee.game.State.prototype.enter.call(this);

		},

		leave: function() {

			lychee.game.State.prototype.leave.call(this);

		},

		update: function(clock, delta) {

			this.__entities.ball.update(clock, delta);
			this.__entities.cpu.update(clock, delta);
			this.__entities.player.update(clock, delta);

			// Ball Entity
			var ball = this.__entities.ball;
			var position = ball.getPosition();
			var velocity = ball.getVelocity();


			// 1. Check if someone won this round
			if (position.x < ball.radius && velocity.x < 0) {
				this.__score.cpu++;
				this.__reset('cpu');
				return;
			}

			if (position.x > this.game.settings.width - ball.radius && velocity.x > 0) {
				this.__score.player++;
				this.__reset('player');
				return;
			}


			// 2. Check if the Ball is outside our world in Y direction
			if (position.y < ball.radius && velocity.y < 0) {
				velocity.y = -velocity.y;
			}

			if (position.y > this.game.settings.height - ball.radius && velocity.y > 0) {
				velocity.y = -velocity.y;
			}


			// 3. Check if the Ball collides with a Paddle
			if (this.__entities.ball.collidesWith(this.__entities.player)) {

				var delta = position.x - this.__entities.player.getPosition().x;
				if (delta >= 0 && velocity.x < 0) {
					velocity.x = -velocity.x;
				}

			}

			if (this.__entities.ball.collidesWith(this.__entities.cpu)) {

				var delta = this.__entities.cpu.getPosition().x - position.x;
				if (delta >= 0 && velocity.x > 0) {
					velocity.x = -velocity.x;
				}

			}


			// 4. AI logic
			var ai = this.__ai;
			var halfpaddleheight = this.__entities.cpu.height / 2;
			var cpuposition = this.__entities.cpu.getPosition();
			if (ai.clock === null) {

				ai.position.y = position.y;
				ai.clock = clock;

			} else if ((clock - ai.clock) > ai.delta) {

				ai.position.y = position.y;


				if (
					ai.position.y < cpuposition.y - halfpaddleheight
					|| ai.position.y > cpuposition.y + halfpaddleheight
				) {

					var vy = ai.position.y > this.__entities.cpu.getPosition().y ? 100 : -100;
					this.__entities.cpu.setVelocity({ y: vy });

					ai.clock = clock;

				} else {
					this.__entities.cpu.setVelocity({ y: 0 });
				}

			}

			if (cpuposition.y < halfpaddleheight) {
				cpuposition.y = halfpaddleheight;
			}

			if (cpuposition.y > this.game.settings.height - halfpaddleheight) {
				cpuposition.y = this.game.settings.height - halfpaddleheight;
			}


			// 5. Player Logic
			var playerposition = this.__entities.player.getPosition();

			var target = this.__target;
			if (
				target.y > playerposition.y - 10
				&& target.y < playerposition.y + 10
			) {
				this.__entities.player.setVelocity({ y: 0 });
			}

			if (playerposition.y < halfpaddleheight) {
				playerposition.y = halfpaddleheight;
			}

			if (playerposition.y > this.game.settings.height - halfpaddleheight) {
				playerposition.y = this.game.settings.height - halfpaddleheight;
			}

		},

		render: function(clock, delta) {

			if (this.renderer !== null) {

				this.renderer.clear();

				this.renderer.renderEntity(this.__entities.ball);
				this.renderer.renderEntity(this.__entities.player);
				this.renderer.renderEntity(this.__entities.cpu);

				this.renderer.drawText(
					100, 20,
					this.__score.player + '',
					this.game.fonts.normal
				);

				this.renderer.drawText(
					this.game.settings.width - 100, 20,
					this.__score.cpu + '',
					this.game.fonts.normal
				);


				this.renderer.flush(0);

			}

		},

		__processTouch: function(id, position, delta) {

			if (this.__locked === true) return;

			if (this.renderer !== null) {

				var env = this.renderer.getEnvironment();

				position.x -= env.offset.x;
				position.y -= env.offset.y;

			}


			var playerposition = this.__entities.player.getPosition();
			if (playerposition.y + 10 > position.y) {
				this.__entities.player.setVelocity({ y: -100 });
			} else if (playerposition.y - 10 < position.y) {
				this.__entities.player.setVelocity({ y: 100 });
			}

			this.__target.y = position.y;

		}

	};


	return Class;

});
