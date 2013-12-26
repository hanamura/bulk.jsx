(function() {
	// constructor
	var Bulk = function(options) {
		this.options = _.extend({
			srcDir: null,
			dstDir: null,
			mask: '*',
			pattern: null,
			deep: true,
			tasks: [],
			savers: []
		}, options);
	};
	// methods
	Bulk.prototype = {
		go: function() {
			// dir
			var srcDir = this.options.srcDir || Folder.selectDialog('input');
			var dstDir = this.options.dstDir || Folder.selectDialog('output');
			if (!srcDir || !dstDir) { return; }
			// proceed
			var index = 0;
			// walk
			bulk.walk(
				srcDir.getFiles(this.options.mask),
				function(srcFile) {
					// pattern
					if (this.options.pattern && !this.options.pattern.test(srcFile.name)) {
						return;
					}
					// doc
					try {
						var doc = open(srcFile);
					} catch (e) {
						return;
					}
					// tasks
					_.each(this.options.tasks, function(task) {
						task.proceed({doc: doc});
					});
					// savers
					_.each(this.options.savers, function(saver) {
						saver.save({
							doc: doc,
							srcDir: srcDir,
							dstDir: dstDir,
							srcFile: srcFile,
							index: index++
						});
					});
					// close
					doc.close(SaveOptions.DONOTSAVECHANGES);
				},
				this,
				{
					mask: this.options.mask,
					depth: this.options.deep ? Number.MAX_VALUE : 0
				}
			);
		}
	};
	this.bulk || this.bulk = {};
	this.bulk.Bulk = Bulk;
}).call(this);

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

(function() {
	// constructor
	var Resize = function(options) {
		this.options = _.extend({
			width: 0,
			height: 0,
			resolution: 72,
			resampleMethod: ResampleMethod.BICUBICSHARPER,
			resizeMethod: 'showall',
			reduceOnly: true,
		}, options);
	};
	// constants
	Resize.SHOWALL = 'showall';
	Resize.NOBORDER = 'noborder';
	Resize.EXACTFIT = 'exactfit';
	// methods
	Resize.prototype = {
		// proceed
		proceed: function(options) {
			var size = this.size(options.doc.width, options.doc.height);
			options.doc.resizeImage(
				size.width,
				size.height,
				this.options.resolution,
				this.options.resampleMethod
			);
		},
		// size
		size: function(docWidth, docHeight) {
			var areaWidth = this.options.width;
			var areaHeight = this.options.height;
			var ratioDoc = docWidth / docHeight;
			var ratioArea = areaWidth / areaHeight;
			var w;
			var h;
			if (
				this.options.reduceOnly &&
				docWidth <= areaWidth &&
				docHeight <= areaHeight
			) {
				w = docWidth;
				h = docHeight;
			} else if (this.options.resizeMethod === Resize.EXACTFIT) {
				w = areaWidth;
				h = areaHeight;
			} else if (this.options.resizeMethod === Resize.SHOWALL) {
				if (ratioArea > ratioDoc) {
					w = docWidth * (areaHeight / docHeight);
					h = areaHeight;
				} else if (ratioArea < ratioDoc) {
					w = areaWidth;
					h = docHeight * (areaWidth / docWidth);
				} else {
					w = areaWidth;
					h = areaHeight;
				}
			} else if (this.options.resizeMethod === Resize.NOBORDER) {
				if (ratioArea > ratioDoc) {
					w = areaWidth;
					h = docHeight * (areaWidth / docWidth);
				} else if (ratioArea < ratioDoc) {
					w = docWidth * (areaHeight / docHeight);
					h = areaHeight;
				} else {
					w = areaWidth;
					h = areaHeight;
				}
			} else {
				throw new Error('unknown resize method');
			}
			return {width: w, height: h};
		}
	};
	this.bulk || this.bulk = {};
	this.bulk.Resize = Resize;
}).call(this);

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
