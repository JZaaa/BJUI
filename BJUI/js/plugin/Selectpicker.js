(function () {
  const NAME = 'BJUI.plugins.selectpicker'

  BJUI.plugins.Selectpicker = {
    init(element, opt = {}) {
      const $el = $(element)
      if ($el.data(NAME)) {
        return
      }
      const options = Object.assign({
        create: false,
        allowEmptyOption: true,
        copyClassesToDropdown: false,
        dropdownParent: 'body',
      }, $el.data() || {}, opt || {})

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
