(function() {
	var Options = {};
	// jpg
	Options.jpg = function(options) {
		options = _.extend({
			quality: 100
		}, options);
		var xo = new ExportOptionsSaveForWeb();
		xo.format = SaveDocumentType.JPEG;
		xo.quality = options.quality;
		return xo;
	};
	// png
	Options.png = function() {
		var xo = new ExportOptionsSaveForWeb();
		xo.format = SaveDocumentType.PNG;
		xo.PNG8 = false;
		xo.quality = 100;
		return xo;
	};
	this.bulk || this.bulk = {};
	this.bulk.Options = Options;
}).call(this);
