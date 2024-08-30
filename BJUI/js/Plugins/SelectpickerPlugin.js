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
      let _default = {}

      if (this._$el.isTag('select') && element.hasAttribute('multiple')) {
        _default = {
          plugins: ['auto_position', 'remove_button'],
        }
      }

      const options = Object.assign({}, BJUI.plugins.Selectpicker.DefaultConfigs, _default, domData || {}, config || {})

      this._plugin = new TomSelect(element, options)

      // 新增样式
      const setListStyle = () => {
        if (this._plugin?.sifter?.items && this._plugin.sifter.items['']) {
          const emptyDiv = this._plugin.sifter.items[''].$div
          if (emptyDiv) {
            emptyDiv.classList.add('empty-option')
          }
        }
        this._plugin.off('dropdown_open', setListStyle)
      }

      const setTextStyle = (val) => {
        if (val && val.length) {
          this._plugin.control.classList.remove('empty-option')
        } else {
          this._plugin.control.classList.add('empty-option')
        }
      }

      if (options.allowEmptyOption) {
        this._plugin.on('dropdown_open', setListStyle)
        this._plugin.on('change', (val) => {
          setTextStyle(val)
        })
        setTextStyle(this._plugin.getValue())
      }


      this._classWatcher = new BJUI.tools.Watcher.ClassWatcher(element, 'is-invalid', () => {
        this._plugin.wrapper.classList.add('is-invalid')
      }, () => {
        this._plugin.wrapper.classList.remove('is-invalid')
      })

      this._$el.data(NAME, this)

      return this._plugin
    }

    setVal(val) {
      this._plugin.setValue(val)
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

  /**
   * 自动展开定位
   */
  TomSelect.define('auto_position', function () {
    const tomSelect = this
    tomSelect.on('dropdown_open', () => {
      const $control = $(tomSelect.control)
      const offset = tomSelect.settings.dropdownParent === 'body' ? $control.offset() : $control.position();
      offset.top += $control.outerHeight(true)

      const $dropdown = $(tomSelect.dropdown)
      const dropdownHeight = $dropdown.prop('scrollHeight') + 5; // 5 - padding value;
      const controlPosTop = $control.get(0).getBoundingClientRect().top;
      const wrapperHeight = $(tomSelect.wrapper).height();
      const controlPosBottom = $control.get(0).getBoundingClientRect().bottom
      const position =
        controlPosTop + dropdownHeight + wrapperHeight > window.innerHeight &&
        controlPosBottom - dropdownHeight - wrapperHeight >= 0 ?
          'top' :
          'bottom';
      let w = tomSelect.wrapper.style.width !== 'fit-content' ? tomSelect.settings.dropdownParent === 'body' ? 'max-content' : '100%' : 'max-content';
      const styles = {
        width: w,
        minWidth: $control.outerWidth(true),
        left: offset.left
      };

      if (position === 'top') {
        const styleToAdd = {bottom: offset.top, top: 'unset'};

        if (tomSelect.settings.dropdownParent === 'body') {
          styleToAdd.top = offset.top - $dropdown.outerHeight(true) - $control.outerHeight(true);
          styleToAdd.bottom = 'unset';
        }
        Object.assign(styles, styleToAdd);
        $dropdown.addClass('selectize-position-top');
        $control.addClass('selectize-position-top');
      } else {
        Object.assign(styles, {top: offset.top, bottom: 'unset'});
        $dropdown.removeClass('selectize-position-top');
        $control.removeClass('selectize-position-top');
      }

      if (tomSelect.settings.dropdownParent !== 'body' && w === 'max-content' && $control.outerWidth(true) >= $dropdown.outerWidth(true)) {
        w = '100%';
      }

      $dropdown.css(styles);
    })
  })

  BJUI.plugins.Selectpicker = {
    DefaultConfigs: {
      plugins: ['no_backspace_delete', 'auto_position'],
      create: false,
      allowEmptyOption: true,
      copyClassesToDropdown: false,
      dropdownParent: 'body',
      render: {
        no_results: function (data, escape) {
          return '<div class="no-results">' + "\u65E0\u5339\u914D\u6570\u636E" + '</div>';
        },
      },
    },
    Instance: SelectpickerPlugin,
  }
}())
