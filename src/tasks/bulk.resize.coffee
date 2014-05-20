@bulk.fn.resize = (opts = null) ->
  opts = _.extend
    type: 'fit'
    width: 0
    height: 0
    reduce: true
    expand: true
    resolution: 72
    resampleMethod: ResampleMethod.BICUBICSHARPER
  , opts

  @push ->
    bounds = switch
      when _.isFunction opts.type
        opts.type \
          opts,
          @doc,
          opts,
      when _.isString opts.type
        rebounds[opts.type] \
          opts,
          @doc,
          opts,
      else
        throw new Error 'Invalid type.'
    @doc.resizeImage \
      bounds.width,
      bounds.height,
      opts.resolution,
      opts.resampleMethod,
