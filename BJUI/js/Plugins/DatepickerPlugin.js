(function () {
  'use strict'

  const NAME = 'BJUI.plugins.datepicker'

  const TOGGLE_ATTR = 'datepicker'

  class DatepickerPlugin {

    constructor (element, options) {
      this._element = element
      this._$el = $(this._element)

      if (!this._$el.length) {
        return
      }

      if (this.constructor.getInstance(element)) {
        return
      }

      if (!element.hasAttribute('data-toggle')) {
        this._$el.attr('data-toggle', TOGGLE_ATTR)
      }

      const _data = this._$el.data() || {}
      const opts = Object.assign({}, BJUI.plugins.Datepicker.DefaultConfigs, options || {})

      const isInput = this._$el.is(':input')

      if (isInput) {
        opts.onBeforeSelect = () => {
          this._$el.data('_isInputVal', false)
          return true
        }
        opts.onHide = (isFinished) => {
          if (isFinished) {
            if (this._$el.data('_isInputVal') && !this._$el.prop('disabled')) {
              const dp = this._plugin.data(NAME);
              if (!dp) {
                return
              }
              const _defaultVal = dp.selectedDates;
              let _val = this._$el.val();
              if (BJUI.test.isEmpty(_val)) {
                dp.clear()
                return
              }
              _val = _val.trim()
              if (BJUI.test.isDate(_val)) {
                dp.selectDate(_val)
              } else {
                dp.selectDate(_defaultVal, {
                  silent: true
                })
              }
            }
            this._$el.trigger('validate')
          }

        }
        this._$el.on('input', () => {
          this._$el.data('_isInputVal', true)
        })
      }

      for (const k in _data) {
        if (_data.hasOwnProperty(k) && (typeof _data[k] === 'string' || typeof _data[k] === 'boolean')) {
          if (k === 'toggle') {
            continue
          }
          opts[k] = _data[k]
        }
      }

      if (!element.hasAttribute('data-toggle')) {
        this._$el.attr('data-toggle', this.toggleAttr)
      }

      this._plugin = new AirDatepicker(element, opts)

      if (this._$el.is(':input')) {
        const _val = this._$el.val()
        if (!BJUI.test.isEmpty(_val)) {
          this._plugin.selectDate(_val, {
            silent: true
          })
          // dp.setViewDate(_val)
        }
      }

      this._$el.data(NAME, this)

      return this._plugin
    }

    dispose() {
      this._plugin.destroy()
      this._$el.data(NAME, false)
    }

    static getInstance(element) {
      return $(element).data(NAME)
    }

    static destroy(element) {
      const Instance = this.getInstance(element)
      if (Instance) {
        Instance.dispose()
      }
    }
  }

  BJUI.plugins.Datepicker = {
    i18n: {
      days: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      daysShort: ['日', '一', '二', '三', '四', '五', '六'],
      daysMin: ['日', '一', '二', '三', '四', '五', '六'],
      months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      today: '今天',
      clear: '清除',
      dateFormat: 'yyyy-MM-dd',
      timeFormat: 'HH:mm',
      firstDay: 1
    },
  }

  BJUI.plugins.Datepicker = Object.assign(BJUI.plugins.Datepicker, {
    DefaultConfigs: {
      autoClose: true,
      locale: BJUI.plugins.Datepicker.i18n,
      timepicker: false,
      onlyTimepicker: false,
      keyboardNav: false,
      onSelect: function ({date, formattedDate, datepicker}) {
        $(datepicker.$el).trigger('afterchange.bjui.datepicker', {date, formattedDate, datepicker})
      }
    },
    Instance: DatepickerPlugin,
  })


}())
