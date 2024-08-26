(function () {
  'use strict'

  const NAME = 'BJUI.plugins.selectpicker'

  BJUI.plugins.Selectpicker = {
    name: NAME,
    toggleAttr: 'selectpicker',
    init(element, opt = {}) {
      const $el = $(element)
      if ($el.data(NAME)) {
        return
      }
      if (!element.hasAttribute('date-toggle')) {
        $el.attr('date-toggle', this.toggleAttr)
      }
      const domData = $el.data()
      const options = Object.assign({
        plugins: ['no_backspace_delete'],
        create: false,
        allowEmptyOption: true,
        copyClassesToDropdown: false,
        dropdownParent: 'body',
        render:{
          no_results: function( data, escape ){
            return '<div class="no-results">' + "\u65E0\u5339\u914D\u6570\u636E" + '</div>';
          },
        }
      }, domData || {}, opt || {})

      const select = new TomSelect(element, options)

      $el.data(NAME, select)

    },
    destroy(element) {
      const $this = $(element)
      const plugin = $this.data(NAME)
      if (plugin) {
        plugin.destroy()
        $this.data(NAME, false)
      }
    }
  }
}())
