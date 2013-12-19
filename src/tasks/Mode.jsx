(function() {
	// constructor
	var Mode = function(options) {
		this.options = _.extend({
			mode: ChangeMode.RGB
		}, options);
	};
	// methods
	Mode.prototype = {
		proceed: function(options) {
			options.doc.changeMode(this.options.mode);
		}
	};
	this.bulk || this.bulk = {};
	this.bulk.Mode = Mode;
}).call(this);
