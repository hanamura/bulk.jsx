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
