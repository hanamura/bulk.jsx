(function() {
	// bulk
	this.bulk || this.bulk = {};
	// vars
	var units, pixels;
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
}).call(this);
