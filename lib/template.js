var fs = require('fs');

var path = __dirname + '/../templates/';

exports.get = function(file) {
	return path + file + '.ejs';
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
