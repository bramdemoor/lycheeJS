
lychee.define('game.demo.Base').exports(function(lychee, global) {

	var Demo = function(game) {

		this.game     = game;
		this.renderer = game.renderer;

		this.__entities = {};

	};


	Demo.prototype = {

		/*
		 * STATE INTEGRATION
		 */

		reset: function() {

			for (var id in this.__entities) {
				delete this.__entities[id];
			}

		},

		touch: function(x, y) {

			for (var id in this.__entities) {

				var entity = this.__entities[id];

				if (typeof entity.trigger !== 'function') continue;


				var position = entity.getPosition();
				var width    = entity.width;
				var height   = entity.height;

				var x1 = position.x - width / 2;
				var x2 = position.x + width / 2;
				var y1 = position.y - height / 2;
				var y2 = position.y + height / 2;

				if (x > x1 && x < x2 && y > y1 && y < y2) {
					entity.trigger('touch');
				}

			}

		},

		update: function(clock, delta) {

			for (var id in this.__entities) {
				this.__entities[id].update(clock, delta);
			}

		},

		render: function() {

			for (var id in this.__entities) {
				this.renderer.renderEntity(this.__entitites[id]);
			}

		},



		/*
		 * PUBLIC API
		 */

		addEntity: function(id, entity) {

			id = typeof id === 'string' ? id : 'entity-' + _id++;

			if (this.__entities[id] === undefined) {
				this.__entities[id] = entity;
				return id;
			}


			return null;

		},

		removeEntity: function(id) {

			id = typeof id === 'string' ? id : null;

			if (id !== null && this.__entities[id] !== undefined) {
				delete this.__entities[id];
				return true;
			}


			return false;

		}

	};


	return Demo;

});

