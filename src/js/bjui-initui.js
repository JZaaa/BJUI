/*!
 * B-JUI  v1.2 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-initui.js  v1.2
 * @author K'naan (xknaan@163.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-initui.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+(function($) {
  'use strict'

  // INITUI CLASS DEFINITION
  // ======================
  var Initui = function(element, options) {
    this.$element = $(element)
    this.options = options
  }

  Initui.DEFAULTS = {}

  Initui.prototype.init = function() {
    var that = this
    var $element = that.$element

    $.when(that.initUI()).done(function() {
      $element.trigger(BJUI.eventType.afterInitUI)
    })
  }

  Initui.prototype.initUI = function() {
    var $element = this.$element

    $.when($element.trigger(BJUI.eventType.beforeInitUI)).done(function() {
      $element.trigger(BJUI.eventType.initUI)
    })
  }

  // INITUI PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    var args = arguments
    var property = option

    return this.each(function() {
      var $this = $(this)
      var options = $.extend({}, Initui.DEFAULTS, $this.data(), typeof option === 'object' && option)
      var data = $this.data('bjui.initui')

      if (!data) $this.data('bjui.initui', (data = new Initui(this, options)))

      if (typeof property === 'string' && $.isFunction(data[property])) {
        [].shift.apply(args)
        if (!args) data[property]()
        else data[property].apply(data, args)
      } else {
        data.init()
      }
    })
  }

  var old = $.fn.initui

  $.fn.initui = Plugin
  $.fn.initui.Constructor = Initui

  // INITUI NO CONFLICT
  // =================

  $.fn.initui.noConflict = function() {
    $.fn.initui = old
    return this
  }

  // INITUI DATA-API
  // ==============

  $(document).on('click.bjui.initui.data-api', '[data-toggle="initui"]', function(e) {
    var $this = $(this)
    Plugin.call($this, $this.data())

    e.preventDefault()
  })

  /* beforeInitUI */
  $(document).on(BJUI.eventType.beforeInitUI, function(e) {
    var $box = $(e.target)
    var noinits = []
    var $noinit = $box.find('[data-noinit]')

    // progress
    $box.find('> .bjui-maskProgress').find('.progress').stop().animate({ width: '85%' }, 'fast')

    // Hide not need to initialize the UI DOM
    $noinit.each(function(i) {
      var $this = $(this)
      var pos = {}

      pos.$target = $this
      pos.$next = $this.next()
      pos.$prev = $this.prev()
      pos.$parent = $this.parent()
      pos.visible = !!$this.is(':visible')

      noinits.push(pos)
      $this.remove()
    })

    $box.data('bjui.noinit', noinits)
  })

  /* initUI */
  $(document).on(BJUI.eventType.initUI, function(e) {
    var $box = $(e.target)

    // progress
    $box.find('> .bjui-maskProgress').find('.progress').stop().animate({ width: '95%' }, 'fast')
  })

  /* afterInitUI */
  $(document).on(BJUI.eventType.afterInitUI, function(e) {
    var $box = $(e.target)
    var noinits = $box.data('bjui.noinit')
    var $form = $box.find('> .bjui-pageContent').find('form')

    // Recovery not need to initialize the UI DOM
    if (noinits) {
      $.each(noinits, function(i, n) {
        if (n.$next.length) n.$next.before(n.$target)
        else if (n.$prev.length) n.$prev.after(n.$target)
        else if (n.$parent.length) n.$parent.append(n.$target)

        if (n.visible) n.$target.show()

        $box.removeData('bjui.noinit')
      })
    }

    /* resizePageH */
    $box.resizePageH()

    // submit
    if ($form.length) {
      $box.find('> .bjui-pageFooter').find(':submit').on('click.bjui.submit', function(e) {
        e.preventDefault()

        $form.submit()
      })
    }

    // progress
    if ($box.data('bj.loading')) {
      $box.Loading('close')
    }
  })

  /* Lateral Navigation */
  $(document).one(BJUI.eventType.afterInitUI, function(e) {
    var $hnavbar = $('#bjui-hnav-navbar'); var $active = $hnavbar.find('> li.active')

    if ($active.length && $active.find('> .items').length) {
      $active.find('> a').trigger('click')
    }
  })

  /* ajaxStatus */
  var bjui_ajaxStatus = function($target, func) {
    var $this = $target
    var $offset = $this
    var position = $this.css('position')

    if (position === 'static') $offset = $this.offsetParent()

    var zIndex = parseInt($offset.css('zIndex')) || 0

    return $this.Loading({
      zIndex: zIndex + 1,
      absolute: $this.hasClass('bjui-dialog'),
      tip: BJUI.regional.progressmsg
    }, func)
  }

  $(document)
    .on('bjui.ajaxStart', function(e, timeout, callback) {
      bjui_ajaxStatus($(e.target), 'open')
      if (callback) {
        setTimeout(function() {
          callback.toFunc().call(this)
        }, 25)
      }
    })
    .on('bjui.ajaxStop', function(e) {
      bjui_ajaxStatus($(e.target), 'close')
    })
    .on('bjui.ajaxError', function(e) {
      bjui_ajaxStatus($(e.target), 'close')
    })

  $(document).on(BJUI.eventType.ajaxStatus, function(e) {
    var $target = $(e.target)
    var loadingWrap = bjui_ajaxStatus($target, 'open')
    $target
      .one('ajaxStart', function() {
        loadingWrap.Loading('open')
      })
      .one('ajaxStop', function() {
        loadingWrap.Loading('close')
      })
      .one('ajaxError', function() {
        loadingWrap.Loading('close')
      })
  })

  /* Clean plugins generated 'Dom elements' in the body */
  var bodyClear = function($target) {
    $target.find('select[data-toggle="selectpicker"]').selectpicker('destroyMenu')
    $target.find('[data-toggle="selectztree"]').trigger('destroy.bjui.selectztree')
  }

  $(document).on(BJUI.eventType.beforeLoadDialog, function(e) {

  }).on(BJUI.eventType.beforeAjaxLoad, function(e) {
    bodyClear($(e.target))
  }).on(BJUI.eventType.beforeCloseNavtab, function(e) {
    bodyClear($(e.target))
  }).on(BJUI.eventType.beforeCloseDialog, function(e) {
    bodyClear($(e.target))
  })

  /* other */
  $(function() {
    $(document).on('keydown keyup', function(e) {
      if (e.which === BJUI.keyCode.CTRL) {
        BJUI.KeyPressed.ctrl = e.type === 'keydown'
      }
      if (e.which === BJUI.keyCode.SHIFT) {
        BJUI.KeyPressed.shift = e.type === 'keydown'
      }
    })
  })
}(jQuery))
