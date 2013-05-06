
lychee.define('lychee.game.State').requires([
	'lychee.game.Entity',
	'lychee.game.Layer'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global) {

	var _layer = lychee.game.Layer;
	var _shape = lychee.game.Entity.SHAPE;


	var _isEntityAtPosition = function(entity, targetX, targetY) {

		var result = false;

		var position = entity.getPosition();
		var shape = entity.getShape();
		if (shape === _shape.circle) {

			var dx = position.x - targetX;
			var dy = position.y - targetY;


			var distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < entity.radius) {
				result = true;
			}

		} else if (shape === _shape.rectangle) {

			var x1 = position.x - entity.width / 2;
			var x2 = position.x + entity.width / 2;
			var y1 = position.y - entity.height / 2;
			var y2 = position.y + entity.height / 2;


			if (
				targetX >= x1 && targetX <= x2
				&& targetY >= y1 && targetY <= y2
			) {
				result = true;
			}

		}


		return result;

	};


	var Class = function(game, id) {

		this.game     = game;
		this.id       = id;

		this.input    = game.input || null;
		this.loop     = game.loop || null;
		this.renderer = game.renderer || null;


		this.__layers      = {};
		this.__focusEntity = null;
		this.__activeSwipeEntities = [];
		this.__activeSwipeOffsets  = [];

		for (var i = 0; i < 10; i++) {
			this.__activeSwipeEntities.push(null);
			this.__activeSwipeOffsets.push({
				x: 0, y: 0
			});
		}


		lychee.event.Emitter.call(this, 'state-' + id);

	};

	Class.prototype = {

		/*
		 * STATE API
		 */

		enter: function() {

			this.trigger('enter');

			var input = this.input;
			if (input !== null) {
				input.bind('key',   this.__processKey,   this);
				input.bind('touch', this.__processTouch, this);
				input.bind('swipe', this.__processSwipe, this);
			}


			var renderer = this.renderer;
			if (renderer !== null) {
				renderer.start();
			}

		},

		leave: function() {

			var renderer = this.renderer;
			if (renderer !== null) {
				renderer.stop();
			}

			var input = this.input;
			if (input !== null) {
				input.unbind('swipe', this.__processSwipe, this);
				input.unbind('touch', this.__processTouch, this);
				input.unbind('key',   this.__processKey,   this);
			}

			this.trigger('leave');

		},

		update: function(clock, delta) {

			for (var id in this.__layers) {

				var layer = this.__layers[id];
				if (layer.isVisible() === false) continue;


				var entities = layer.getEntities();
				for (var e = 0, el = entities.length; e < el; e++) {
					entities[e].update(clock, delta);
				}

			}

		},

		render: function(clock, delta) {

			var renderer = this.renderer;
			if (renderer !== null) {

				var env = renderer.getEnvironment();
				var offsetX = env.width / 2;
				var offsetY = env.height / 2;


				renderer.clear();

				for (var id in this.__layers) {

					var layer = this.__layers[id];
					if (layer.isVisible() === false) continue;


					var entities = layer.getEntities();
					for (var e = 0, el = entities.length; e < el; e++) {

						renderer.renderEntity(
							entities[e],
							offsetX,
							offsetY
						);

					}

				}

				renderer.flush();

			}

		},



		/*
		 * LAYER API
		 */

		addLayer: function(id, layer) {

			id = typeof id === 'string' ? id : null;

			if (id !== null && layer instanceof _layer) {
				this.__layers[id] = layer;
				return true;
			}


			return false;

		},

		getLayer: function(id) {

			id = typeof id === 'string' ? id : null;

			if (id !== null && this.__layers[id] !== undefined) {
				return this.__layers[id];
			}


			return null;

		},

		removeLayer: function(id) {

			id = typeof id === 'string' ? id : null;

			if (id !== null && this.__layers[id] !== undefined) {
				delete this.__layers[id];
				return true;
			}


			return false;

		},



		/*
		 * PRIVATE API
		 */

		__processKey: function(key, name, delta) {

			if (this.__focusEntity !== null) {
				this.__focusEntity.trigger('key', [ key, name, delta ]);
			}

		},


		__processSwipe: function(id, type, position, delta, swipe) {

			if (this.__activeSwipeEntities[id] !== undefined) {

				var entity = this.__activeSwipeEntities[id];
				var offset = this.__activeSwipeOffsets[id];


				if (this.renderer !== null) {

					var env = this.renderer.getEnvironment();

					position.x -= env.offset.x;
					position.y -= env.offset.y;

					position.x -= env.width / 2;
					position.y -= env.height / 2;

				}


				if (
					type === 'start'
					&& entity === null
				) {

					for (var id in this.__layers) {

						var layer = this.__layers[id];

						var entities = layer.getEntities();
						for (var e = 0, el = entities.length; e < el; e++) {

							// Reset incrementally calculated offset
							// for each entity
							offset.x = 0;
							offset.y = 0;


							var triggered = this.__processSwipeRecursive(
								entities[e],
								position.x,
								position.y,
								offset
							);

							if (triggered !== null) {
								entity = triggered;
								break;
							}

						}

					}


					if (entity !== null) {

console.log('SWIPESTART', entity);

						position.x -= offset.x;
						position.y -= offset.y;

						entity.trigger('swipe', [
							id, type, position, delta, swipe
						]);


						this.__activeSwipeEntities[id] = entity;

					}


				} else if (
					type === 'move'
					&& entity !== null
				) {

console.log('SWIPEMOVE', entity);

					position.x -= offset.x;
					position.y -= offset.y;

 					entity.trigger('swipe', [
						id, type, position, delta, swipe
					]);

				} else if (
					type === 'end'
					&& entity !== null
				) {

console.log('SWIPEEND', entity);

					position.x -= offset.x;
					position.y -= offset.y;

 					entity.trigger('swipe', [
						id, type, position, delta, swipe
					]);


					this.__activeSwipeEntities[id] = null;

				}

			}

		},

		__processSwipeRecursive: function(entity, originX, originY, offset) {


// TODO: trace the entities recursively
// and update the offset incrementally
// to calculate the offsets for the swipe position
// fired in start/move/end

		},


		__processTouch: function(id, position, delta) {

			if (this.renderer !== null) {

				var env = this.renderer.getEnvironment();

				position.x -= env.offset.x;
				position.y -= env.offset.y;

				position.x -= env.width / 2;
				position.y -= env.height / 2;

			}


			var args = [ id, {
				x: position.x,
				y: position.y
			}, delta ];


			var oldFocusEntity = this.__focusEntity;
			var newFocusEntity = null;


			for (var id in this.__layers) {

				var layer = this.__layers[id];

				var entities = layer.getEntities();
				for (var e = 0, el = entities.length; e < el; e++) {

					var triggered = this.__processTouchRecursive(
						entities[e],
						position.x,
						position.y,
						args
					);

					if (triggered !== null) {
						newFocusEntity = triggered;
						break;
					}

				}

			}


			if (newFocusEntity !== oldFocusEntity) {

				if (oldFocusEntity !== null) {
					oldFocusEntity.trigger('blur');
				}

				if (newFocusEntity !== null) {
					newFocusEntity.trigger('focus');
				}

				this.__focusEntity = newFocusEntity;

			}

		},

		__processTouchRecursive: function(entity, originX, originY, args) {

			var triggered = null;


			if (_isEntityAtPosition(entity, originX, originY) === true) {

				var position = entity.getPosition();

				if (typeof entity.getEntities === 'function') {

					var entities = entity.getEntities();
					for (var e = 0, el = entities.length; e < el; e++) {

						var result = this.__processTouchRecursive(
							entities[e],
							originX - position.x,
							originY - position.y,
							args
						);


						if (result !== null) {
							triggered = result;
						}

					}

				}


				if (typeof entity.trigger === 'function') {

					args[1].x = originX - position.x;
					args[1].y = originY - position.y;

					var result = entity.trigger('touch', args);
					if (result === true && triggered === null) {
						triggered = entity;
					}

				}

			}


			return triggered;

		}

	};


	return Class;

});

