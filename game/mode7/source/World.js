
lychee.define('game.World').requires([
	'game.entity.Background',
	'game.Track'
]).exports(function(lychee, global) {

	var Class = function(data) {

		this.__id = data.id || 'default-id';
		this.__description = data.description || 'This is the default description';
		this.__image = data.image || null;

		this.__backgrounds = [];
		this.__tracks      = [];
		this.__sprites     = [];


		this.__deserialize(
			data.spritemap || null,
			data.tracks || null
		);

	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__deserialize: function(spritemap, tracks) {

			for (var s = 0, sl = spritemap.length; s < sl; s++) {

				var entry = spritemap[s];
				if (entry.type === 'background') {
					this.__backgrounds.push(new game.entity.Background(entry));
				} else if (entry.type === 'sprite') {
					this.__sprites.push(sprite);
				}

			}


			// Sort the backgrounds by their z-index
			// higher z distance means farther away
			this.__backgrounds.sort(function(a, b) {
				return a.getPosition().z < b.getPosition().z;
			});


			for (var t = 0, tl = tracks.length; t < tl; t++) {
				this.__tracks.push(new game.Track(tracks[t], this));
			}

		},



		/*
		 * PUBLIC API
		 */

		getId: function() {
			return this.__id;
		},

		getImage: function() {
			return this.__image;
		},

		getDescription: function() {
			return this.__description;
		},

		getBackgrounds: function() {
			return this.__backgrounds;
		},

		getBackground: function(id) {

			for (var b = 0, bl = this.__backgrounds.length; b < bl; b++) {

				var background = this.__backgrounds[b];
				if (background.getId() === id) {
					return background;
				}

			}


			return null;

		},

		getTrack: function(id) {

			for (var t = 0, tl = this.__tracks.length; t < tl; t++) {

				var track = this.__tracks[t];
				if (track.getId() === id) {
					return track;
				}

			}


			return null;

		}

	};


	return Class;

});

