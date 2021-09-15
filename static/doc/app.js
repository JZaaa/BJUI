
(function() {
  $(document).on(BJUI.eventType.initUI, function(e) {
    var $box = $(e.target)
    if (!$box.is(document)) {
      $box.find('code').each(function() {
        const template = $(this).find('template')
        if (template.length) {
          $(this).text(template.html())
          Prism.highlightElement(this)
        }
      })
    }
  })
}())
