(function() {
	// bulk
	this.bulk || this.bulk = {};
	// vars
	var units, pixels, pad;
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
}).call(this);
