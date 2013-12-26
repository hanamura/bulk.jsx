(function() {
	// constructor
	var Log = function(options) {
		this.options = _.extend({
			template: '<%= filename %>'
		}, options);
	};
	// methods
	Log.prototype = {
		save: function(options) {
			var message = _.template(this.options.template, options);
			$.writeln(message);
		}
	};
	this.bulk || this.bulk = {};
	this.bulk.Log = Log;
}).call(this);
