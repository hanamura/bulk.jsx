# bulk
# ====

_bulk = @bulk

@bulk = class bulk
	src: -> @_src

	options: -> _.clone @_opts

	tasks: (tasks) ->
		if tasks isnt undefined
			@_tasks = tasks[..]
			@
		else
			@_tasks[..]

	opensDoc: (opens) ->
		if opens isnt undefined
			@_opensDoc = @_opensDoc || opens
			@
		else
			@_opensDoc

	constructor: (src, opts = null) ->
		if @ instanceof bulk
			@_src = src
			@_opts = opts
			@_tasks = []
			@_opensDoc = false
		else
			return new bulk src, opts

	push: (task, opensDoc = true) ->
		new bulk @_src, @_opts
			.tasks @_tasks.concat [task]
			.opensDoc @_opensDoc || opensDoc

	pass: (fns...) ->
		for fn in fns
			fn.call @
		@

	exec: (opts = null) ->
		opts = _.extend
			units: Units.PIXELS
		, opts

		src = switch
			when @_src instanceof bulk then @_src.src()
			when _.isFunction @_src then @_src()
			else @_src

		bulk.units opts.units, =>
			index = 0
			bulk.walk src, f = (s) =>
				info = switch
					when s instanceof File
						try
							new bulk.DocInfo
								doc: if @_opensDoc then open s else null
								file: s
								index: index++
						catch e
					when s instanceof app.Document
						new bulk.DocInfo
							doc: s
							file: try s.fullName catch e then null
							index: index++
				if info
					for task in @_tasks
						task.call info
					if info.doc
						info.doc.close SaveOptions.DONOTSAVECHANGES
			, f, @_opts

		@

bulk.fn = bulk.prototype

bulk.noConflict = =>
	@bulk = _bulk
	bulk

# DocInfo
# =======

bulk.DocInfo = class DocInfo
	constructor: (opts = null) ->
		{doc: @doc, file: @file, index: @index} = _.extend
			doc: null
			file: null
			index: -1
		, opts

		if @file
			@filename = @file.name
			@basename = bulk.basename @file.name
			@extension = bulk.extension @file.name

# utils
# =====

bulk.walk = (src, f, g, opts = null) ->
	opts = _.extend
		filePattern: null
		folderPattern: null
		mask: '*'
		deep: true
	, opts

	switch
		when src instanceof Folder
			if not opts.folderPattern or opts.folderPattern.test src.name
				if opts.deep
					bulk.walk \
						src.getFiles(opts.mask),
						f,
						g,
						opts,
				else
					bulk.walk \
						(s for s in src.getFiles(opts.mask) when s instanceof File),
						f,
						g,
						opts,
		when src instanceof File
			if not opts.filePattern or opts.filePattern.test src.name
				f and f src
		when _.isArray src
			bulk.walk s, f, g, opts for s in src
		when _.isString src
			bulk.walk \
				File(src),
				f,
				g,
				opts,
		else
			g and g src

	return

bulk.basename = (name) ->
	i = name.lastIndexOf '.'
	if i < 0
		name
	else
		name.substring 0, i

bulk.extension = (name) ->
	i = name.lastIndexOf '.'
	if i < 0
		''
	else
		name.substring i + 1

bulk.units = (units, fn, context = null) ->
	[units_, preferences.rulerUnits] = [preferences.rulerUnits, units]
	fn.call context
	preferences.rulerUnits = units_

bulk.pixels = (fn, context = null) ->
	bulk.units Units.PIXELS, fn, context

bulk.pad = (str, len, pad = '0', right = false) ->
	while str.length < len
		str = if right then str + pad else pad + str
	str
