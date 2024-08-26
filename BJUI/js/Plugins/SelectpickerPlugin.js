(function () {
  'use strict'

  const NAME = 'BJUI.plugins.selectpicker'

  const TOGGLE_ATTR = 'selectpicker'

  class SelectpickerPlugin {
    constructor(element, config) {
      this._element = element
      this._$el = $(element)

      if (!this._$el.length) {
        return
      }

      if (this._element.tomselect) {
        return
      }

      if (!element.hasAttribute('data-toggle')) {
        this._$el.attr('data-toggle', TOGGLE_ATTR)
      }

      const domData = this._$el.data()
      const options = Object.assign(BJUI.plugins.Selectpicker.DefaultConfigs, domData || {}, config || {})

      this._plugin = new TomSelect(element, options)

      this._classWatcher = new BJUI.tools.Watcher.ClassWatcher(element, 'is-invalid', () => {
        this._plugin.wrapper.classList.add('is-invalid')
      }, () => {
        this._plugin.wrapper.classList.remove('is-invalid')
      })

      this._$el.data(NAME, this)

      return this._plugin
    }

    dispose() {
      this._element.tomselect.destroy()
      this._classWatcher.disconnect()
      this._$el.data(NAME, false)
    }

    static getInstance(element) {
      return $(element).data(NAME)
    }


    static destroy(element) {

      const Instance = this.getInstance(element)
      if (Instance) {
        Instance.dispose()
      } else {
        const plugin = element.tomselect
        if (plugin) {
          plugin.destroy()
        }
      }
    }

  }

  BJUI.plugins.Selectpicker = {
    DefaultConfigs: {
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
    },
    Instance: SelectpickerPlugin,
  }
}())
