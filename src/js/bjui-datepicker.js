/*!
 * B-JUI  v1.2 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-datepicker.js  v2.0
 * ======================================================================== */

+(function($) {
  'use strict'

  const Default = {
    dateFormat: 'Y-m-d',
    mode: 'single',
    enableTime: false,
    enableSeconds: false,
    wrap: false,
    onChange: null
  }

  class Datepicker {
    constructor(element, options) {
      this._options = $.extend({}, Default, options || {})
      this._$element = $(element)
    }

    init() {
      const $this = this._$element
      let $picker
      $this.removeAttr('data-toggle')
      const op = this._options

      if ($this.isTag('input') && !op.wrap) {
        const val = $this.val()
        const wrap = (`
          <span class="bj-time-picker ${val && val.length ? 'not-empty' : ''}">
          </span>
          `)
        $this.attr('data-input', true)
        $this.wrap(wrap)
        $picker = $this.parent()
        $picker.append(`<i class="bj-time-picker-icon bi-calendar" data-toggle></i><i class="bj-time-clear-icon bi-x-circle-fill" data-clear></i>`)
        op.wrap = true

        $this.on('change', function() {
          const val = $(this).val()
          if (val && val.length) {
            $picker.addClass('not-empty')
          } else {
            $picker.removeClass('not-empty')
          }
        })
      } else {
        $picker = $this
      }
      if (!op.onChange) {
        op.onChange = (selectedDates, dateStr, instance) => {
          $this.trigger('afterchange.bjui.datepicker', [selectedDates, dateStr, instance])
        }
      }
      this._flatpickr = $picker.flatpickr(op)
    }
  }

  // DATEPICKER PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    var args = arguments
    var property = option

    return this.each(function() {
      var $this = $(this)
      const op = $this.data() || {}
      let options = op.options
      if (options && typeof options === 'string') options = options.toObj()
      if (options) $.extend(op, typeof options === 'object' && options)

      var data = $this.data('bjui.datepicker')

      if (!data) $this.data('bjui.datepicker', (data = new Datepicker(this, op)))
      if (typeof property === 'string' && $.isFunction(data[property])) {
        [].shift.apply(args)
        if (!args) data[property]()
        else data[property].apply(data, args)
      } else {
        data.init()
      }
    })
  }

  var old = $.fn.datepicker

  $.fn.datepicker = Plugin
  $.fn.datepicker.Constructor = Datepicker

  // DATEPICKER NO CONFLICT
  // =================

  $.fn.datepicker.noConflict = function() {
    $.fn.datepicker = old
    return this
  }

  // DATEPICKER DATA-API
  // ==============

  $(document).on(BJUI.eventType.initUI, function(e) {
    var $this = $(e.target).find('[data-toggle="datepicker"]')

    if (!$this.length) return

    Plugin.call($this)
  })
}(jQuery))
