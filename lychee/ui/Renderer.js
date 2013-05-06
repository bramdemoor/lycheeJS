
lychee.define('lychee.ui.Renderer').requires([
	'lychee.ui.Area',
	'lychee.ui.Button',
	'lychee.ui.Input',
	'lychee.ui.Slider',
	'lychee.ui.Textarea',
	'lychee.ui.Wizard'
]).includes([
	'lychee.Renderer'
]).exports(function(lychee, global) {

	var _area     = lychee.ui.Area;
	var _button   = lychee.ui.Button;
	var _input    = lychee.ui.Input;
	var _slider   = lychee.ui.Slider;
	var _textarea = lychee.ui.Textarea;
	var _wizard   = lychee.ui.Wizard;


	var Class = function(id) {

		lychee.Renderer.call(this, id);

	};


	Class.prototype = {

		renderEntity: function(entity, offsetX, offsetY) {

			if (entity instanceof _area) {
				this.renderUIArea(entity, offsetX, offsetY);
			} else if (entity instanceof _button) {
				this.renderUIButton(entity, offsetX, offsetY);
			} else if (entity instanceof _input) {
				this.renderUIInput(entity, offsetX, offsetY);
			} else if (entity instanceof _slider) {
				this.renderUISlider(entity, offsetX, offsetY);
			} else if (entity instanceof _textarea) {
				this.renderUITextarea(entity, offsetX, offsetY);

			// TODO: Implement renderUIWizard
			// } else if (entity instanceof _wizard) {
			// this.renderUIWizard(entity, offsetX, offsetY);
			}

		},

		renderUIArea: function(entity, offsetX, offsetY) {

			offsetX = offsetX || 0;
			offsetY = offsetY || 0;


			var position = entity.getPosition();

			var realX = position.x + offsetX;
			var realY = position.y + offsetY;


			if (lychee.debug === true) {

				var hwidth  = entity.width / 2;
				var hheight = entity.height / 2;

				this.drawBox(
					realX - hwidth,
					realY - hheight,
					realX + hwidth,
					realY + hheight,
					'#ff00ff',
					false,
					1
				);

			}


			var entities = entity.getEntities();

			for (var e = 0, el = entities.length; e < el; e++) {
				this.renderEntity(entities[e], realX, realY);
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

		renderUIInput: function(entity, offsetX, offsetY) {

			offsetX = offsetX || 0;
			offsetY = offsetY || 0;


			var position = entity.getPosition();

			var realX = position.x + offsetX;
			var realY = position.y + offsetY;

			if (
				realX >= 0 && realX <= this.__width
				&& realY >= 0 && realY <= this.__height
			) {

				var hwidth  = entity.width / 2;
				var hheight = entity.height / 2;

				var bgcolor = entity.getState() === 'active' ? '#666666' : '#333333';


				this.setAlpha(0.5);

				this.drawBox(
					realX - hwidth,
					realY - hheight,
					realX + hwidth,
					realY + hheight,
					bgcolor,
					true
				);

				this.setAlpha(1.0);


				this.flush(1);

				this.setBufferBoundaries(
					realX - hwidth,
					realY - hheight,
					realX + hwidth,
					realY + hheight
				);


				var font = entity.getFont();
				if (font !== null) {

					var text = entity.getText();
					var offset = entity.getOffset();

					this.drawText(
						realX - hwidth + offset,
						realY - hheight,
						text,
						font,
						false
					);

				}

				this.flush(2);

			}

		},

		renderUISlider: function(entity, offsetX, offsetY) {

			offsetX = offsetX || 0;
			offsetY = offsetY || 0;


			var position = entity.getPosition();

			var realX = position.x + offsetX;
			var realY = position.y + offsetY;


			if (
				realX >= 0 && realX <= this.__width
				&& realY >= 0 && realY <= this.__height
			) {


				var bgcolor = entity.getState() === 'active' ? '#666666' : '#333333';

				var radius = entity.radius;
				if (radius > 0) {

					this.setAlpha(0.5);

					this.drawCircle(
						realX,
						realY,
						radius,
						bgcolor,
						true
					);

					this.setAlpha(1.0);


					var drag = entity.getDrag();

					this.drawCircle(
						realX + drag.x,
						realY + drag.y,
						24,
						'#ff0000',
						true
					);

				}

			}

		},

		renderUITextarea: function(entity, offsetX, offsetY) {

			offsetX = offsetX || 0;
			offsetY = offsetY || 0;


			var position = entity.getPosition();

			var realX = position.x + offsetX;
			var realY = position.y + offsetY;

			if (
				realX >= 0 && realX <= this.__width
				&& realY >= 0 && realY <= this.__height
			) {

				var hwidth  = entity.width / 2;
				var hheight = entity.height / 2;

				var bgcolor = entity.getState() === 'active' ? '#666666' : '#333333';


				this.setAlpha(0.5);

				this.drawBox(
					realX - hwidth,
					realY - hheight,
					realX + hwidth,
					realY + hheight,
					bgcolor,
					true
				);

				this.setAlpha(1.0);


				this.flush(1);

				this.setBufferBoundaries(
					realX - hwidth,
					realY - hheight,
					realX + hwidth,
					realY + hheight
				);


				var font = entity.getFont();
				if (font !== null) {

					var lines = entity.getLines();
					for (var l = 0, ll = lines.length; l < ll; l++) {

						var text   = entity.getText(l);
						var offset = entity.getOffset(l);

						if (offset >= 0 && offset <= hheight * 2) {

							this.drawText(
								realX - hwidth,
								realY - hheight + offset,
								text,
								font,
								false
							);

						}

					}

				}

				this.flush(2);

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

