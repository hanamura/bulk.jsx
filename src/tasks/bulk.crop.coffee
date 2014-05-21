@bulk.fn.crop = (opts = null) ->
  opts = _.extend
    width: 0
    height: 0
    anchor: AnchorPosition.MIDDLECENTER
  , opts

  @push ->
    @doc.resizeCanvas \
      Math.min(opts.width, @doc.width),
      Math.min(opts.height, @doc.height),
      opts.anchor,
