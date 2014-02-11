@bulk.fn.export = (opts = null) ->
	opts = _.extend
		dest: null
		filename: '<%= filename %>'
		overwrite: 'ask'
		exportType: null
		exportOptions: null
	, opts

	_dest = (info, dest) ->
		switch
			when dest instanceof Folder then new Folder dest.absoluteURI
			when _.isFunction dest then _dest info, dest.call info
			when _.isString dest
				folder = info.file.parent
				folder.changePath _.template dest, info
				folder
			else info.file.parent

	_name = (info, name) ->
		switch
			when _.isFunction name then _name info, name.call info
			when _.isString name then _.template name, info
			else info.file.name

	@push ->
		dest = _dest @, opts.dest
		name = _name @, opts.filename
		file = new File "#{dest.absoluteURI}/#{name}"

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
