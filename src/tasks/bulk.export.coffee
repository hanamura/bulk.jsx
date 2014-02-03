@bulk.fn.export = (opts = null) ->
	opts = _.extend
		dest: null
		filename: '<%= filename %>'
		overwrite: 'ask'
		exportType: null
		exportOptions: null
	, opts

	@push ->
		dest = switch
			when opts.dest instanceof Folder then new Folder opts.dest.absoluteURI
			when _.isFunction opts.dest then opts.dest @
			when _.isString opts.dest
				folder = @file.parent
				folder.changePath _.template opts.dest, @
				folder
			else @file.parent

		filename = switch
			when _.isString opts.filename then _.template opts.filename, @
			when _.isFunction opts.filename then opts.filename @
			else @file.name

		file = new File "#{dest.absoluteURI}/#{filename}"

		if file.exists and opts.overwrite isnt true and opts.overwrite isnt 'ask'
			return
		if file.exists and opts.overwrite is 'ask' and not confirm """A file "#{file.name}" already exists in "#{file.parent.fullName}". Is it OK to overwrite?"""
			return

		file.parent.create()
		@doc.exportDocument \
			file,
			opts.exportType,
			opts.exportOptions,

@bulk.fn.jpg = (opts = null) ->
	opts = _.extend
		dest: null
		filename: '<%= basename %>.jpg'
		overwrite: 'ask'
		quality: 100
	, opts

	exportOptions = new ExportOptionsSaveForWeb
	exportOptions.format = SaveDocumentType.JPEG
	exportOptions.quality = opts.quality

	@export _.extend {}, opts,
		exportType: ExportType.SAVEFORWEB
		exportOptions: exportOptions

@bulk.fn.png = (opts = null) ->
	opts = _.extend
		dest: null
		filename: '<%= basename %>.jpg'
		overwrite: 'ask'
	, opts

	exportOptions = new ExportOptionsSaveForWeb
	exportOptions.format = SaveDocumentType.PNG
	exportOptions.PNG8 = false
	exportOptions.quality = 100

	@export _.extend {}, opts,
		exportType: ExportType.SAVEFORWEB
		exportOptions: exportOptions
