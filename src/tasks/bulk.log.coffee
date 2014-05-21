@bulk.fn.log = (opts = null) ->
  opts = _.extend
    template: '<%= filename %>'
    opensDoc: true
  , opts

  @push ->
    $.writeln _.template opts.template, @
  , opts.opensDoc
