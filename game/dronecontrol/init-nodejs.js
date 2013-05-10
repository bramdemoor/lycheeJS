
var path = "../../lychee";

require(path + '/core.js');
require(path + '/Builder.js');
require(path + '/Preloader.js');

// bootstrap.js requires the root path to this file.
require(path + '/platform/nodejs/bootstrap.js')(__dirname);

require('./source/Server.js');


lychee.debug = true;

lychee.rebase({
	lychee: "../../lychee",
	game: "./source"
});

lychee.tag({
	platform: [ 'nodejs' ]
});


lychee.build(function(lychee, global) {

	var drone = new game.ar.Drone({
		ip: '192.168.1.1'
	});

	new game.Server(drone);

}, typeof global !== 'undefined' ? global : this);


