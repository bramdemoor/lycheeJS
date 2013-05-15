
// Set to true to see lychee debug messages
lychee.debug = true;


// Rebase required namespaces for inclusion
lychee.rebase({
	lychee: "../../lychee",
	game: "./source"
});


// Tags are required to determine which libraries to load
(function(lychee, global) {

	var platform = [ 'webgl', 'html', 'nodejs' ];

	if (global.navigator && global.navigator.appName === 'V8GL') {
		platform = [ 'v8gl' ];
	}

	lychee.tag({
		platform: platform
	});

})(lychee, typeof global !== 'undefined' ? global : this);


lychee.build(function(lychee, global) {

	var settings = {
		base: './asset',
		host: 'localhost',
		fullscreen: true
	};

	if (document && document.location) {
		settings.host = document.location.hostname;
	}

	new game.Main(settings);

}, typeof global !== 'undefined' ? global : this);

