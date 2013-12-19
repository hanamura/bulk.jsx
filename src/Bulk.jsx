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
					var doc = open(srcFile);
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
					depth: depth: this.options.deep ? Number.MAX_VALUE : 0
				}
			);
		}
	};
	this.bulk || this.bulk = {};
	this.bulk.Bulk = Bulk;
}).call(this);
