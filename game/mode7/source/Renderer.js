
lychee.define('game.Renderer').includes([
	'lychee.Renderer'
]).requires([
	'game.entity.Background',
	'game.entity.Ship'
]).exports(function(lychee, global) {

	var Class = function(id) {

		lychee.Renderer.call(this, id);

		this.__projectionCache = [
			{ x: 0, y: 0, z: 0, w: 0 }, // segment / from
			{ x: 0, y: 0, z: 0, w: 0 }, // segment / to
			{ x: 0, y: 0, z: 0, w: 0 }  // ship / position
		];

	};

	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__applyProjection: function(target, point, x, y, z, depth) {

			var cameraX = (point.x || 0) - x;
			var cameraY = (point.y || 0) - y;
			var cameraZ = (point.z || 0) - z;


			var hwidth  = this.__width / 2;
			var hheight = this.__height / 2;
			var scale = depth / cameraZ;


			// x, y, depth, road width
 			target.x = Math.round(  hwidth + scale * cameraX *  hwidth );
			target.y = Math.round( hheight - scale * cameraY * hheight );
			target.z = cameraZ;
			//                                       road width (!)
			//                                       \/\/\/\/\/\/
			target.w = Math.round(           scale * 1.5 * hwidth * hwidth );

		},



		/*
		 * PUBLIC API
		 */

		renderBackgrounds: function(image, backgrounds, camera) {

			for (var b = 0, bl = backgrounds.length; b < bl; b++) {

				var entity = backgrounds[b];
				var map = entity.getMap();


				// TODO: Implement parallax effect based on z-index,
				// background size and viewport size
				var x = 0;
				var y = 0;


				this.drawSprite(
					x,
					y,
					image,
					map
				);

			}

		},

		renderSegments: function(segments, camera, length) {

			var position = camera.getPosition();
			var cameraDepth = camera.getDepth();


			var z = position.z;
			var allZ = (length / 200) | 0;
			var currentZ = ((z / 200) | 0) % allZ;
			var current  = segments[currentZ];

			var from = this.__projectionCache[0];
			var to   = this.__projectionCache[1];


			var maxY = this.__height;
			var x    = 0;
			var dx   = -1 * (current.curviness * (z % 200) / 200) | 0;


			var index = current.index;
			for (var i = 0; i < 300; i++) {

				var segment = segments[(index + i) % allZ];
				var offset  = segment.index < current.index ? length : 0;

				this.__applyProjection(
					from,
					segment.from,
					position.x - x,
					position.y,
					position.z - offset,
					cameraDepth
				);

				this.__applyProjection(
					to,
					segment.to,
					position.x - x - dx,
					position.y,
					position.z - offset,
					cameraDepth
				);


				x += dx;
				dx += segment.curviness;


				if (
					to.y < maxY
				) {

					this.renderSegment(
						from.x, from.y, from.w,
						to.x,     to.y,   to.w,
						segment.palette
					);

					maxY = to.y;

				}

			}

		},

		renderSegment: function(x1, y1, w1, x2, y2, w2, palette) {


			var lanes = 4;

			var r1 = w1 / Math.max(6,  2 * lanes);
			var r2 = w2 / Math.max(6,  2 * lanes);
			var l1 = w1 / Math.max(32, 8 * lanes);
			var l2 = w2 / Math.max(32, 8 * lanes);


			this.__ctx.fillStyle = palette.terrain;
			this.__ctx.fillRect(0, y2, this.__width, y1 - y2);


			if (palette.rumble !== null) {

				this.drawPolygon(
					4,
					x1 - w1 - r1, y1,
					x1 - w1,      y1,
					x2 - w2,      y2,
					x2 - w2 - r2, y2,
					palette.rumble,
					true
				);

				this.drawPolygon(
					4,
					x1 + w1 + r1, y1,
					x1 + w1,      y1,
					x2 + w2,      y2,
					x2 + w2 + r2, y2,
					palette.rumble,
					true
				);

			}

			if (palette.road !== null) {

				this.drawPolygon(
					4,
					x1 - w1,    y1,
					x1 + w1,    y1,
					x2 + w2,    y2,
					x2 - w2,    y2,
					palette.road,
					true
				);

			}

			if (palette.lane !== null) {

				var lw1 = w1 * 2 / lanes;
				var lw2 = w2 * 2 / lanes;
				var lx1 = x1 - w1 + lw1;
				var lx2 = x2 - w2 + lw2;

				for (var l = 1; l < lanes; lx1 += lw1, lx2 += lw2, l++) {

					this.drawPolygon(
						4,
						lx1 - l1/2, y1,
						lx1 + l1/2, y1,
						lx2 + l2/2, y2,
						lx2 - l2/2, y2,
						palette.lane,
						true
					);

				}

			}

		},

		renderShip: function(image, ship, camera, length) {

			var cameraPosition = camera.getPosition();
			var cameraDepth = camera.getDepth();

			var position = ship.getPosition();
			var point = this.__projectionCache[2];

			if (position.z < cameraPosition.z) {
				position.z += length;
			}

			this.__applyProjection(
				point,
				position,
				cameraPosition.x,
				cameraPosition.y,
				cameraPosition.z,
				cameraDepth
			);


			var maxY = this.__height;

			if (point.y > 0 && point.y < maxY) {

				var map = ship.getMap();

				this.drawSprite(
					point.x - 32,
					point.y - 32,
					image,
					map
				);


/*				this.drawTriangle(
					point.x, point.y - 10,
					point.x - 10, point.y + 10,
					point.x + 10, point.y + 10,
					'#ff0000',
					true
				);
*/
			}

		}

	};


	return Class;

});

