@bulk.fn.mode = (opts = null) ->
	opts = _.extend
		mode: ChangeMode.RGB
	, opts

	@push ->
		@doc.changeMode opts.mode
