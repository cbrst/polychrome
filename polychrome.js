#!/usr/bin/env node
var argv     = require('argv')
  , ejs      = require('ejs')
  , scheme   = require('./lib/scheme')
  , template = require('./lib/template')
  , version  = '0.0.1';

var render = function(theme, temp, options) {
	ejs.renderFile(template.get(temp), scheme.get(theme, options), function(err, result) {
		if (err) return(err);
		console.log(result);
	});
}

// JS needs HEREDOC now!
var helpstring = '[Usage] init.js <command>\n\n' +
'[COMMANDS]\n\n' +
'	render\n' +
'		Render a template with a scheme\n' +
'		render <scheme> <template> [options]\n' +
'	list\n' +
'		List schemes or templates\n' +
'		list <schemes|templates>\n' +
'	show\n' +
'		Build and print the scheme object. Useful for debugging.\n' +
'		show <scheme> [options]\n\n' +
'[OPTIONS]';

// Option parsing time!

argv.version(version);
argv.info(helpstring);
argv.option({
	name: 'brightness',
	short: 'b',
	type: 'float',
	description: 'Changes the theme\'s brightness',
	example: 'colorbuild --brightness="-0.5"'
});
argv.option({
	name: 'saturation',
	short: 's',
	type: 'float',
	description: 'Changes the theme\'s saturation',
	example: 'colorbuild --saturation="-0.5"'
});
var args = argv.run();

switch ( args.targets[0] ) {
	case 'render':
		render(args.targets[1], args.targets[2], args.options);
		break;

	case 'list':
		switch ( args.targets[1] ) {
			case 'schemes':
				scheme.list();
				break;

			case 'templates':
				template.list();
				break;

			default:
				console.log('What should I list?');
		}
		break;

	case 'show':
		console.log(scheme.get(args.targets[1], args.options));
		break;

	default:
		argv.help();
}
