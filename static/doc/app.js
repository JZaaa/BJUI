(function() {
  $(document).on(BJUI.eventType.initUI, function(e) {

    const wrapPrismFixed = function($element) {
      $element.wrap('<div class="bj-doc-code-grid"><div class="bj-doc--code-content"></div></div>')
    }
    var $box = $(e.target)
    if (!$box.is(document)) {
      $box.find('code').each(function() {
        const $that = $(this)
        wrapPrismFixed($that.closest('pre'))
        const template = $that.find('template')
        if (template.length) {
          $(this).text(template.html())
          // Prism.highlightElement(this)
        }
      })
      $box.find('script[class^="language-"]').each(function() {
        wrapPrismFixed($(this))
      })
      Prism.highlightAll()
      // $box.find('prism-html-markup').each(function() {
      // Prism.highlightElement(this)
      // })
    }
  })
}())
