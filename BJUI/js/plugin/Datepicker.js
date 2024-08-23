(function () {
  'use strict'

  const NAME = 'BJUI.plugins.datepicker'

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
    init: function (element, opt = {}) {
      var $el = $(element)
      if ($el.data(NAME)) {
        return
      }
      var _data = $el.data() || {}
      var opts = Object.assign({
        autoClose: true,
        locale: this.i18n,
        timepicker: false,
        onlyTimepicker: false,
        keyboardNav: false,
        onSelect: function ({date, formattedDate, datepicker}) {
          $el.trigger('afterchange.bjui.datepicker', {date, formattedDate, datepicker})
        }
      }, opt || {})

      var isInput = $el.is(':input')

      if (isInput) {
        opts.onBeforeSelect = function () {
          $el.data('_isInputVal', false)
          return true
        }
        opts.onHide = function (isFinished) {
          if (isFinished) {
            if ($el.data('_isInputVal') && !$el.prop('disabled')) {
              var dp = $el.data(NAME)
              if (!dp) {
                return
              }
              var _defaultVal = dp.selectedDates
              var _val = $el.val()
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
            $el.trigger('validate')
          }

        }
        $el.on('input', function () {
          $el.data('_isInputVal', true)
        })
      }

      for (var k in _data) {
        if (_data.hasOwnProperty(k) && (typeof _data[k] === 'string' || typeof _data[k] === 'boolean')) {
          if (k === 'toggle') {
            continue
          }
          opts[k] = _data[k]
        }
      }


      var dp = new AirDatepicker(element, opts)

      $el.data(NAME, dp)
      if ($el.is(':input')) {
        var _val = $el.val()
        if (!BJUI.test.isEmpty(_val)) {
          dp.selectDate(_val, {
            silent: true
          })
          // dp.setViewDate(_val)
        }
      }

      return dp
    },
    destroy: function (element) {
      const $this = $(element)
      const plugin = $this.data(NAME)
      if (plugin) {
        plugin.destroy()
        $this.data(NAME, false)
      }
    }

  }
}())
