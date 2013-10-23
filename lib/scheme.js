var fs = require('fs')
  , c  = require('color');

var path = __dirname + '/../schemes/';
var schemepath = function(file) {
	return path + file;
};

var isdark = function(color) {
	if ( c(color).dark() )
		return true
	else
		return false
};

var makehash = function(color) {
	return {
		hex: color.hexString(),
		hsl: color.hsl(),
		rgb: color.rgb()
	}
};

exports.get = function(file, options) {
	var options = options || {}
	  , saturation = options.saturation || 0
	  , brightness = options.brightness || 0;

	// load scheme file
	var config = require(schemepath(file));
	var scheme = {};

	scheme.name = config['name'];

	// generate hex/hsl/rgb values
	scheme.color = [];
	if ( config['color'].length == 16 ) {
		// If the scheme has 16 colors already, just use them
		config['color'].forEach(function(value) {
			var color = c(value).lighten(brightness).saturate(saturation);
			scheme.color.push(makehash(color));
		});
	}
	else if ( config['color'].length == 8 ) {
		// Otherwise, if it has 8, generate the missing 8 automatically
		config['color'].forEach(function(value) {
			var color = c(value).lighten(brightness).saturate(saturation);
			scheme.color.push(makehash(color));
		});
		if ( isdark(config['background']) ) {
		// if the background is dark, make them brighter
			config['color'].forEach(function(value) {
				var color = c(value).lighten(0.2).lighten(brightness).saturate(saturation);
				scheme.color.push(makehash(color));
			});
		}
		else {
		// otherwise make them darker
			config['color'].forEach(function(value) {
				var color = c(value).darken(0.3).lighten(brightness).saturate(saturation);
				scheme.color.push(makehash(color));
			});
		}
	}

	var bgcolor = c(config['background']);
	if ( isdark(config['background']) ) {
		scheme.background = [
			makehash(bgcolor),
			makehash(bgcolor.darken(0.3)),
			makehash(bgcolor.lighten(1)),
			makehash(bgcolor.lighten(2))
		];
	}
	else {
		scheme.background = [
			makehash(bgcolor),
			makehash(bgcolor.lighten(0.3)),
			makehash(bgcolor.darken(1)),
			makehash(bgcolor.darken(2))
		];
	}

	scheme.foreground = {
		hex: c(config['foreground']).hexString(),
		hsl: c(config['foreground']).hsl(),
		rgb: c(config['foreground']).rgb()
	};

	// check wether the scheme is light or dark
	scheme.isdark = isdark(config['background']);

	return scheme;
};

exports.list = function() {
	fs.readdir(path, function(err, files) {
		if ( err ) return console.log(err);
		var re = /(?:([^.]+)\.[^.]+)?$/;
		files.forEach(function(name) {
			console.log(re.exec(name)[1]);
		});
	});
};
