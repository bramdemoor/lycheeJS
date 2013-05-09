
lychee.define('game.demo.Base').exports(function(lychee, global) {

	var Demo = function(state) {

		this.state = state;
		this.layer = state.getLayer('demo');

		this.__entities = {};

	};


	Demo.prototype = {

	};


	return Demo;

});

