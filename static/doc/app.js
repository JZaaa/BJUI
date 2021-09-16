
(function() {
  $(document).on(BJUI.eventType.initUI, function(e) {
    var $box = $(e.target)
    if (!$box.is(document)) {
      $box.find('code').each(function() {
        const $that = $(this)
        $that.closest('pre').wrap('<div class="bj-doc-code-grid"><div class="bj-doc--code-content"></div></div>')
        const template = $that.find('template')
        if (template.length) {
          $(this).text(template.html())
          Prism.highlightElement(this)
        }
      })
    }
  })
}())
