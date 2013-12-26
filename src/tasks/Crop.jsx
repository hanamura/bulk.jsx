(function() {
	// constructor
	var Crop = function(options) {
		this.options = _.extend({
			width: 0,
			height: 0,
			anchor: AnchorPosition.MIDDLECENTER
		}, options);
	};
	// methods
	Crop.prototype = {
		proceed: function(options) {
			var width = Math.min(this.options.width, options.doc.width);
			var height = Math.min(this.options.height, options.doc.height);
			options.doc.resizeCanvas(width, height, this.options.anchor);
		}
	};
	this.bulk || this.bulk = {};
	this.bulk.Crop = Crop;
}).call(this);
