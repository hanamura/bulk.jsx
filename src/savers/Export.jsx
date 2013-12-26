(function() {
	// constructor
	var Export = function(options) {
		this.options = _.extend({
			option: null,
			exportType: ExportType.SAVEFORWEB,
			template: '<%= filename %>'
		}, options);
	};
	// methods
	Export.prototype = {
		save: function(options) {
			// filename
			var filename = _.template(this.options.template, options);
			// file
			var file = new File(options.dstDir.absoluteURI + '/' + filename);
			// export
			options.doc.exportDocument(file, this.options.exportType, this.options.option);
		},
	};
	this.bulk || this.bulk = {};
	this.bulk.Export = Export;
}).call(this);
