
var path = "../../lychee";

require(path + '/core.js');
require(path + '/Builder.js');
require(path + '/Preloader.js');

// bootstrap.js requires the root path to this file.
require(path + '/platform/nodejs/bootstrap.js')(__dirname);

require('./source/Server.js');


// TODO: Make this generic :)
var ar_drone = require('ar-drone');

global.drone = ar_drone.createClient('192.168.1.1');


lychee.debug = true;

lychee.rebase({
	lychee: "../../lychee",
	game: "./source"
});

lychee.tag({
	platform: [ 'nodejs' ]
});


lychee.build(function(lychee, global) {

	var settings = {
	};

	new game.Server(settings);

}, typeof global !== 'undefined' ? global : this);


