(function() {
	// bulk
	this.bulk || this.bulk = {};
	// vars
	var units, pixels, pad, walk;
	// units
	this.bulk.units = units = function(units, fn, context) {
		var units_ = preferences.rulerUnits;
		preferences.rulerUnits = units;
		fn.call(context);
		preferences.rulerUnits = units_;
	};
	// pixels
	this.bulk.pixels = pixels = function(fn, context) {
		units(Units.PIXELS, fn, context);
	};
	// pad
	this.bulk.pad = pad = function(str, len, pad, right) {
		pad || pad = '0';
		while (str.length < len) {
			if (right) {
				str = str + pad;
			} else {
				str = pad + str;
			}
		}
		return str;
	};
	// walk
	this.bulk.walk = walk = function(files, fn, context, options) {
		options = _.extend({
			mask: '*',
			depth: Number.MAX_VALUE
		}, options);
		if (options.depth < 0) {
			return;
		}
		_.each(files, function(file) {
			if (file instanceof Folder) {
				walk(
					file.getFiles(options.mask),
					fn,
					context,
					{mask: options.mask, depth: options.depth - 1}
				);
			} else {
				fn.call(context, file);
			}
		});
	}
}).call(this);
