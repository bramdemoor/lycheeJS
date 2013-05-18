 lychee.debug = true;

lychee.rebase({	lychee: "../../lychee",	game: "./source"});

(function(lychee, global) {
	var platform = [ 'webgl', 'html', 'nodejs' ];

	if (global.navigator && global.navigator.appName === 'V8GL') {
		platform = [ 'v8gl' ];
	}

	lychee.tag({ platform: platform	});

})(lychee, typeof global !== 'undefined' ? global : this);

lychee.build(function(lychee, global) {

	new game.Main({base: './asset', music: true, sound: true });

}, typeof global !== 'undefined' ? global : this);

