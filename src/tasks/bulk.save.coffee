@bulk.fn.save = ->
  @push ->
    @doc.save()
