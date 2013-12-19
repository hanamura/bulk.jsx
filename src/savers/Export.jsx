(function() {
	// constructor
	var Export = function(options) {
		this.options = _.extend({
			option: null,
			exportType: ExportType.SAVEFORWEB,
			template: '<%= basename %>.<%= extension %>'
		}, options);
	};
	// methods
	Export.prototype = {
		save: function(options) {
			// defaults
			var index = options.srcFile.name.lastIndexOf('.');
			var defaults = {};
			if (index < 0) {
				defaults['basename'] = options.srcFile.name;
				defaults['extension'] = '';
			} else {
				defaults['basename'] = options.srcFile.name.substring(0, index);
				defaults['extension'] = options.srcFile.name.substring(index + 1);
			}
			// filename
			var filename = _.template(this.options.template, _.extend(defaults, options));
			// file
			var file = new File(options.dstDir.absoluteURI + '/' + filename);
			// export
			options.doc.exportDocument(file, this.options.exportType, this.options.option);
		},
	};
	this.bulk || this.bulk = {};
	this.bulk.Export = Export;
}).call(this);
