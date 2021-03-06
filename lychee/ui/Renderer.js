
lychee.define('lychee.ui.Renderer').requires([
	'lychee.ui.Area',
	'lychee.ui.Button'
]).includes([
	'lychee.Renderer'
]).exports(function(lychee, global) {

	var _area   = lychee.ui.Area;
	var _button = lychee.ui.Button;


	var Class = function(id) {

		lychee.Renderer.call(this, id);

	};


	Class.prototype = {

		__renderUIEntity: function(entity, offsetX, offsetY) {

			if (entity instanceof _area) {
				this.renderUIArea(entity, offsetX, offsetY);
			} else if (entity instanceof _button) {
				this.renderUIButton(entity, offsetX, offsetY);
			}

		},

		renderUIArea: function(entity, offsetX, offsetY) {

			offsetX = offsetX || 0;
			offsetY = offsetY || 0;


			var position = entity.getPosition();

			var realX = position.x + offsetX;
			var realY = position.y + offsetY;


			var children = entity.getChildren();

			for (var c = 0, cl = children.length; c < cl; c++) {
				this.__renderUIEntity(children[c], realX, realY);
			}

		},

		renderUIButton: function(entity, offsetX, offsetY) {

			offsetX = offsetX || 0;
			offsetY = offsetY || 0;


			var position = entity.getPosition();

			var realX = position.x + offsetX;
			var realY = position.y + offsetY;


			if (
				realX >= 0 && realX <= this.__width
				&& realY >= 0 && realY <= this.__height
			) {

				var label = entity.getLabel();
				var font  = entity.getFont();
				if (label !== null && font !== null) {

					this.drawText(
						realX, realY,
						label, font,
						true
					);

				}

			}

		},

		renderUIWizard: function(entity, offsetX, offsetY) {

			offsetX = offsetX || 0;
			offsetY = offsetY || 0;


			var position = entity.getPosition();

			var realX = position.x + offsetX;
			var realY = position.y + offsetY;


			if (
				realX >= 0 && realX <= this.__width
				&& realY >= 0 && realY <= this.__height
			) {

				var area = entity.getArea();
				if (area !== null) {
					this.renderUIArea(area, realX, realY);
				}

			}

		}

	};


	return Class;

});

