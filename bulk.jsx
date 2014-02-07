(function() {
  var DocInfo, bulk, _bulk,
    __slice = [].slice;

  _bulk = this.bulk;

  this.bulk = bulk = (function() {
    bulk.prototype.src = function() {
      return this._src;
    };

    bulk.prototype.options = function() {
      return _.clone(this._opts);
    };

    bulk.prototype.tasks = function(tasks) {
      if (tasks !== void 0) {
        this._tasks = tasks.slice(0);
        return this;
      } else {
        return this._tasks.slice(0);
      }
    };

    bulk.prototype.opensDoc = function(opens) {
      if (opens !== void 0) {
        this._opensDoc = this._opensDoc || opens;
        return this;
      } else {
        return this._opensDoc;
      }
    };

    function bulk(src, opts) {
      if (opts == null) {
        opts = null;
      }
      if (this instanceof bulk) {
        this._src = src;
        this._opts = opts;
        this._tasks = [];
        this._opensDoc = false;
        this.data = {};
      } else {
        return new bulk(src, opts);
      }
    }

    bulk.prototype.push = function(task, opensDoc) {
      var b;
      if (opensDoc == null) {
        opensDoc = true;
      }
      b = new bulk(this._src, this._opts).tasks(this._tasks.concat([task])).opensDoc(this._opensDoc || opensDoc);
      b.data = _.clone(this.data);
      return b;
    };

    bulk.prototype.pass = function() {
      var fn, fns, _i, _len;
      fns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = fns.length; _i < _len; _i++) {
        fn = fns[_i];
        fn.call(this);
      }
      return this;
    };

    bulk.prototype.exec = function(opts) {
      var src;
      if (opts == null) {
        opts = null;
      }
      opts = _.extend({
        units: Units.PIXELS
      }, opts);
      src = (function() {
        switch (false) {
          case !(this._src instanceof bulk):
            return this._src.src();
          case !_.isFunction(this._src):
            return this._src();
          default:
            return this._src;
        }
      }).call(this);
      bulk.units(opts.units, (function(_this) {
        return function() {
          var f, index;
          index = 0;
          return bulk.walk(src, f = function(s) {
            var e, info, task, _i, _len, _ref;
            info = (function() {
              switch (false) {
                case !(s instanceof File):
                  try {
                    return new bulk.DocInfo({
                      doc: this._opensDoc ? open(s) : null,
                      file: s,
                      index: index++,
                      bulk: this
                    });
                  } catch (_error) {
                    e = _error;
                  }
                  break;
                case !(s instanceof app.Document):
                  return new bulk.DocInfo({
                    doc: s,
                    file: (function() {
                      try {
                        return s.fullName;
                      } catch (_error) {
                        e = _error;
                        return null;
                      }
                    })(),
                    index: index++,
                    bulk: this
                  });
              }
            }).call(_this);
            if (info) {
              _ref = _this._tasks;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                task = _ref[_i];
                task.call(info);
              }
              if (info.doc) {
                return info.doc.close(SaveOptions.DONOTSAVECHANGES);
              }
            }
          }, f, _this._opts);
        };
      })(this));
      return this;
    };

    return bulk;

  })();

  bulk.fn = bulk.prototype;

  bulk.noConflict = (function(_this) {
    return function() {
      _this.bulk = _bulk;
      return bulk;
    };
  })(this);

  bulk.DocInfo = DocInfo = (function() {
    function DocInfo(opts) {
      var _ref;
      if (opts == null) {
        opts = null;
      }
      _ref = _.extend({
        doc: null,
        file: null,
        index: -1,
        bulk: null
      }, opts), this.doc = _ref.doc, this.file = _ref.file, this.index = _ref.index, this.bulk = _ref.bulk;
      this.data = {};
      if (this.file) {
        this.filename = this.file.name;
        this.basename = bulk.basename(this.file.name);
        this.extension = bulk.extension(this.file.name);
      }
    }

    return DocInfo;

  })();

  bulk.walk = function(src, f, g, opts) {
    var s, _i, _len;
    if (opts == null) {
      opts = null;
    }
    opts = _.extend({
      filePattern: null,
      folderPattern: null,
      mask: '*',
      deep: true
    }, opts);
    switch (false) {
      case !(src instanceof Folder):
        if (!opts.folderPattern || opts.folderPattern.test(src.name)) {
          if (opts.deep) {
            bulk.walk(src.getFiles(opts.mask), f, g, opts);
          } else {
            bulk.walk((function() {
              var _i, _len, _ref, _results;
              _ref = src.getFiles(opts.mask);
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                s = _ref[_i];
                if (s instanceof File) {
                  _results.push(s);
                }
              }
              return _results;
            })(), f, g, opts);
          }
        }
        break;
      case !(src instanceof File):
        if (!opts.filePattern || opts.filePattern.test(src.name)) {
          f && f(src);
        }
        break;
      case !_.isArray(src):
        for (_i = 0, _len = src.length; _i < _len; _i++) {
          s = src[_i];
          bulk.walk(s, f, g, opts);
        }
        break;
      case !_.isString(src):
        bulk.walk(File(src), f, g, opts);
        break;
      default:
        g && g(src);
    }
  };

  bulk.basename = function(name) {
    var i;
    i = name.lastIndexOf('.');
    if (i < 0) {
      return name;
    } else {
      return name.substring(0, i);
    }
  };

  bulk.extension = function(name) {
    var i;
    i = name.lastIndexOf('.');
    if (i < 0) {
      return '';
    } else {
      return name.substring(i + 1);
    }
  };

  bulk.units = function(units, fn, context) {
    var units_, _ref;
    if (context == null) {
      context = null;
    }
    _ref = [preferences.rulerUnits, units], units_ = _ref[0], preferences.rulerUnits = _ref[1];
    fn.call(context);
    return preferences.rulerUnits = units_;
  };

  bulk.pixels = function(fn, context) {
    if (context == null) {
      context = null;
    }
    return bulk.units(Units.PIXELS, fn, context);
  };

  bulk.pad = function(str, len, pad, right) {
    if (pad == null) {
      pad = '0';
    }
    if (right == null) {
      right = false;
    }
    while (str.length < len) {
      str = right ? str + pad : pad + str;
    }
    return str;
  };

}).call(this);

(function() {
  this.bulk.fn.crop = function(opts) {
    if (opts == null) {
      opts = null;
    }
    opts = _.extend({
      width: 0,
      height: 0,
      anchor: AnchorPosition.MIDDLECENTER
    }, opts);
    return this.push(function() {
      return this.doc.resizeCanvas(Math.min(opts.width, this.doc.width), Math.min(opts.height, this.doc.height), opts.anchor);
    });
  };

}).call(this);

(function() {
  this.bulk.fn["export"] = function(opts) {
    if (opts == null) {
      opts = null;
    }
    opts = _.extend({
      dest: null,
      filename: '<%= filename %>',
      overwrite: 'ask',
      exportType: null,
      exportOptions: null
    }, opts);
    return this.push(function() {
      var dest, file, filename, folder;
      dest = (function() {
        switch (false) {
          case !(opts.dest instanceof Folder):
            return new Folder(opts.dest.absoluteURI);
          case !_.isFunction(opts.dest):
            return opts.dest(this);
          case !_.isString(opts.dest):
            folder = this.file.parent;
            folder.changePath(_.template(opts.dest, this));
            return folder;
          default:
            return this.file.parent;
        }
      }).call(this);
      filename = (function() {
        switch (false) {
          case !_.isString(opts.filename):
            return _.template(opts.filename, this);
          case !_.isFunction(opts.filename):
            return opts.filename(this);
          default:
            return this.file.name;
        }
      }).call(this);
      file = new File("" + dest.absoluteURI + "/" + filename);
      if (file.exists && opts.overwrite !== true && opts.overwrite !== 'ask') {
        return;
      }
      if (file.exists && opts.overwrite === 'ask' && !confirm("A file \"" + file.name + "\" already exists in \"" + file.parent.fullName + "\". Is it OK to overwrite?")) {
        return;
      }
      file.parent.create();
      return this.doc.exportDocument(file, opts.exportType, opts.exportOptions);
    });
  };

  this.bulk.fn.jpg = function(opts) {
    var exportOptions;
    if (opts == null) {
      opts = null;
    }
    opts = _.extend({
      dest: null,
      filename: '<%= basename %>.jpg',
      overwrite: 'ask',
      quality: 100
    }, opts);
    exportOptions = new ExportOptionsSaveForWeb;
    exportOptions.format = SaveDocumentType.JPEG;
    exportOptions.quality = opts.quality;
    return this["export"](_.extend({}, opts, {
      exportType: ExportType.SAVEFORWEB,
      exportOptions: exportOptions
    }));
  };

  this.bulk.fn.png = function(opts) {
    var exportOptions;
    if (opts == null) {
      opts = null;
    }
    opts = _.extend({
      dest: null,
      filename: '<%= basename %>.jpg',
      overwrite: 'ask'
    }, opts);
    exportOptions = new ExportOptionsSaveForWeb;
    exportOptions.format = SaveDocumentType.PNG;
    exportOptions.PNG8 = false;
    exportOptions.quality = 100;
    return this["export"](_.extend({}, opts, {
      exportType: ExportType.SAVEFORWEB,
      exportOptions: exportOptions
    }));
  };

}).call(this);

(function() {
  this.bulk.fn.log = function(opts) {
    if (opts == null) {
      opts = null;
    }
    opts = _.extend({
      template: '<%= filename %>',
      opensDoc: true
    }, opts);
    return this.push(function() {
      return $.writeln(_.template(opts.template, this));
    }, opts.opensDoc);
  };

}).call(this);

(function() {
  this.bulk.fn.mode = function(opts) {
    if (opts == null) {
      opts = null;
    }
    opts = _.extend({
      mode: ChangeMode.RGB
    }, opts);
    return this.push(function() {
      return this.doc.changeMode(opts.mode);
    });
  };

}).call(this);

(function() {
  this.bulk.fn.resize = function(opts) {
    if (opts == null) {
      opts = null;
    }
    opts = _.extend({
      type: 'fit',
      width: 0,
      height: 0,
      reduce: true,
      expand: true,
      resolution: 72,
      resampleMethod: ResampleMethod.BICUBICSHARPER
    }, opts);
    return this.push(function() {
      var bounds;
      bounds = (function() {
        switch (false) {
          case !_.isFunction(opts.type):
            return opts.type(opts, this.doc, opts);
          case !_.isString(opts.type):
            return rebounds[opts.type](opts, this.doc, opts);
          default:
            throw new Error('Invalid type.');
        }
      }).call(this);
      return this.doc.resizeImage(bounds.width, bounds.height, opts.resolution, opts.resampleMethod);
    });
  };

}).call(this);

(function() {
  this.bulk.fn.save = function() {
    return this.push(function() {
      return this.doc.save();
    });
  };

}).call(this);
