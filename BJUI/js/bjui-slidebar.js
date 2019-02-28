/*!
 * B-JUI  v1.2 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-slidebar.js  v1.2
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.barDrag.js (author:Roger Wu)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-slidebar.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+(function($) {
  'use strict'

  // SLIDEBAR CLASS INSTANCE
  // ======================
  $(function() {
    $('#bjui-leftside').after('<!-- Adjust the width of Left slide -->').after(FRAG.splitBar).after(FRAG.splitBarProxy)
  })

  // SLIDEBAR CLASS DEFINITION
  // ======================

  var Slidebar = function(element, options) {
    this.$element = $(element)
    this.$bar = this.$element.find('#bjui-sidebar')
    this.$sbar = this.$element.find('#bjui-sidebar-s')
    this.$accordionmenu = this.$bar.find('#bjui-accordionmenu')
    this.$lock = this.$bar.find('> .toggleCollapse > .lock')
    this.$navtab = $('#bjui-navtab')
    this.$collapse = this.$sbar.find('.collapse')
    this.$split = $('#bjui-splitBar')
    this.$split2 = $('#bjui-splitBarProxy')

    this.isfloat = false
    this.options = options
  }

  Slidebar.prototype.lock = function() {
    var that = this
    var cleft = that.$bar.outerWidth() + 4
    var cwidth = BJUI.windowWidth - $('#bjui-sidebar').width() - 6

    that.faLock()
    that.hoverLock()
    that.$sbar.animate({ left: -10 }, 20)
    that.$bar.removeClass('shadown')
    that.isfloat = false
    that.$navtab.animate({ left: cleft, width: cwidth }, 500, function() {
      $(window).trigger(BJUI.eventType.resizeGrid)
    })
    that.$split.show()
  }

  Slidebar.prototype.unlock = function() {
    var that = this
    var barleft = 0 - that.$bar.outerWidth()
    var cwidth = BJUI.windowWidth - 6

    that.faUnLock()
    that.hoverUnLock()
    that.$navtab.animate({ left: 6, width: cwidth }, 400)
    that.$bar.animate({ left: barleft }, 500, function() {
      that.$sbar.animate({ left: 0 }, 200)
      that.$split.hide()
      $(window).trigger(BJUI.eventType.resizeGrid)
    })
    that.isfloat = false
  }

  Slidebar.prototype.float = function() {
    var that = this

    that.$sbar.animate({ left: -10 }, 200)
    that.$bar.addClass('shadown').animate({ left: 0 }, 500)
    that.isfloat = true
  }

  Slidebar.prototype.hideFloat = function() {
    var that = this
    var barleft = 0 - that.$bar.outerWidth()

    that.$bar.animate({ left: barleft - 10 }, 500, function() {
      that.$sbar.animate({ left: 0 }, 100)
    })
    that.isfloat = false
  }

  Slidebar.prototype.hoverLock = function() {
    var that = this

    that.$lock
      .hover(function() {
        that.tipUnLock()
        that.faUnLock()
      }, function() {
        that.tipLock()
        that.faLock()
      })
  }

  Slidebar.prototype.hoverUnLock = function() {
    var that = this

    that.$lock
      .hover(function() {
        that.tipLock()
        that.faLock()
      }, function() {
        that.tipUnLock()
        that.faUnLock()
      })
  }

  Slidebar.prototype.tipLock = function() {
    this.$lock.tooltip('destroy').tooltip({ title: '保持锁定，始终显示导航栏', container: 'body' })
  }

  Slidebar.prototype.tipUnLock = function() {
    this.$lock.tooltip('destroy').tooltip({ title: '解除锁定，自动隐藏导航栏', container: 'body' })
  }

  Slidebar.prototype.faLock = function() {
    this.$lock.find('> i').attr('class', 'fa fa-lock')
  }

  Slidebar.prototype.faUnLock = function() {
    this.$lock.find('> i').attr('class', 'fa fa-unlock-alt')
  }

  Slidebar.prototype.init = function() {
    var that = this
    if (!BJUI.ui.showSlidebar) {
      that.unlock()
    } else {
      that.hoverLock()
    }

    this.$lock.off('click.bjui.slidebar').on('click.bjui.slidebar', function() {
      if (that.isfloat) {
        that.lock()
      } else {
        that.unlock()
      }
      BJUI.ui.showSlidebar = !BJUI.ui.showSlidebar
    })

    this.$collapse.hover(function() {
      that.float()
      that.$navtab.click(function() {
        if (that.isfloat) that.hideFloat()
      })
    })

    this.$split.mousedown(function(e) {
      that.$split2.each(function() {
        var $spbar2 = $(this)

        setTimeout(function() { $spbar2.show() }, 100)
        $spbar2
          .css({ visibility: 'visible', left: that.$split.css('left') })
          .basedrag($.extend(that.options, { obj: that.$bar, move: 'horizontal', event: e, stop: function() {
            $(this).css('visibility', 'hidden')
            var move = parseInt($(this).css('left')) - parseInt(that.$split.css('left'))
            var sbarwidth = that.$bar.outerWidth() + move
            var cleft = parseInt(that.$navtab.css('left')) + move
            var cwidth = that.$navtab.outerWidth() - move

            that.$bar.css('width', sbarwidth)
            that.$split.css('left', $(this).css('left'))
            that.$navtab.css({ left: cleft, width: cwidth })
          } }))

        return false
      })
    })

    // move hnav
    if ($('#bjui-hnav-navbar-box').length) {
      that.moveHnav()
    }

    // menus-header添加active属性
    that.$accordionmenu
      .collapse()
      .on('hidden.bs.collapse', function(e) {
        $(this).find('> .panel > .panel-heading').each(function() {
          var $heading = $(this)
          var $a = $heading.find('> h4 > a')

          if ($a.hasClass('collapsed')) {
            $heading.removeClass('active')
            var $panel = $heading.parent()
            if ($panel.is(':last-child')) {
              $panel.removeClass('last-child')
            }
          }
        })
      })
      .on('shown.bs.collapse', function(e) {
        $(this).find('> .panel > .panel-heading').each(function() {
          var $heading = $(this)
          var $a = $heading.find('> h4 > a')

          if (!$a.hasClass('collapsed')) {
            $heading.addClass('active')
            var $panel = $heading.parent()
            if ($panel.is(':last-child')) {
              $panel.addClass('last-child')
            }
          }
        })
      })

    that.clickMenu()
  }

  // 点击菜单
  Slidebar.prototype.clickMenu = function() {
    var that = this
    that.$bar.on('click', 'ul.menu-items li > a', function(e) {
      e.preventDefault()
      var $a = $(this)
      var $li = $a.parent()
      var options = $a.data('options').toObj()
      var $children = $li.find('> .menu-items-children')
      var onClose = function() {
        $li.removeClass('active')
      }
      var onSwitch = function() {
        that.$accordionmenu.find('ul.menu-items li').removeClass('switch')
        $li.addClass('switch')
      }

      $li.addClass('active')
      if (options) {
        options.url = $a.attr('href')
        if (options.url && options.url !== 'javascript:;') {
          options.onClose = onClose
          options.onSwitch = onSwitch

          if (!options.title) options.title = $a.text()

          if (!options.target) {
            $a.navtab(options)
          } else {
            $a.dialog(options)
          }
        }
      }
      if ($children.length) {
        $li.toggleClass('open')
      }
    })
  }

  Slidebar.prototype.moveHnav = function() {
    var $hnavbox = $('#bjui-hnav-navbar-box')

    var $hnavbar = $hnavbox.find('> #bjui-hnav-navbar')

    var $hmoreL = $hnavbox.prev()

    var $hmoreR = $hnavbox.next()

    $hmoreL.hover(function() {
      $hnavbar.stop().animate({ left: 0 }, 2000, function() {
        $hmoreL.hide()
      })
    }, function() {
      $hnavbar.stop()
      if ($hnavbox.data('hnav.move')) {
        $hmoreR.show()
      }
    }).on('click', function() {
      $hnavbar.stop().animate({ left: 0 }, 'fast', function() {
        $hmoreL.hide()
      })
      return false
    })

    $hmoreR.hover(function() {
      $hnavbar.stop().animate({ left: ($hnavbox.width() - $hnavbox.data('hnav.liw') - 10) }, 2000, function() {
        $hmoreR.hide()
      })
    }, function() {
      $hnavbar.stop()
      if ($hnavbar.css('left') !== '0px') {
        $hmoreL.show()
      }
    }).on('click', function() {
      $hnavbar.stop().animate({ left: ($hnavbox.width() - $hnavbox.data('hnav.liw') - 10) }, 'fast', function() {
        $hmoreR.hide()
      })
      return false
    })
  }

  Slidebar.prototype.initHnav = function() {
    var that = this

    var title = that.$element.text().trim()

    var $li = that.$element.parent()

    var $box = $('#bjui-accordionmenu')

    var $trees
    var $items
    var $panel
    var $array

    $trees = $li.find('> .items > ul.ztree')
    $items = $li.find('> .items > ul.menu-items')
    if (!($trees.length || $items.length)) return
    if ($trees.length) $array = $trees
    if ($items.length) {
      if (!$array) $array = $items
      else $array = $array.add($items)

      $items.find('a').each(function() {
        var $a = $(this); var options = $a.data('options')

        if (!$a.data('icon.init') && options && typeof options === 'string') {
          options = options.toObj()
          if (options && options.faicon) {
            options.faicon = options.faicon.trim()
            if (options.faicon.startsWith('fa-')) options.faicon = options.faicon.substr(3)
            $a.prepend('<i class="fa fa-' + options.faicon + '"></i>').data('icon.init', true).attr('title', $a.text())
          }
        }
      })
    }

    $box.empty()
    $array.each(function(i) {
      var $t = $(this)
      var panel
      var cls
      var bodycls
      var faicon = $t.data('faicon')
      var icon = faicon || 'dot-circle-o'

      if ($t.data('tit')) title = $t.data('tit')

      cls = i ? 'collapsed' : ''
      bodycls = i ? '' : ' in'
      panel = FRAG.slidePanel
        .replaceAll('#id#', 'bjui-collapse' + i)
        .replaceAll('#title#', title)
        .replaceAll('#righticon#', '<i class="fa fa-angle-down"></i>')
        .replaceAll('#class#', cls)
        .replaceAll('#bodyclass#', bodycls)

      if (icon) panel = panel.replaceAll('#icon#', '<i class="fa fa-' + icon + '"></i>')
      else panel = panel.replaceAll('#icon#', '')

      $panel = $(panel)
      $panel.find('> .panel-collapse > .panel-body').append($t.removeAttr('data-noinit'))
      $box.append($panel)

      if (!i) $panel.collapse('show')
    })
    $('#bjui-sidebar').initui()
    $li
      .addClass('active')
      .data('bjui.slidebar.hnav.panels', $box.find('> .panel'))
      .siblings().removeClass('active')
  }

  // SLIDEBAR PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    var args = arguments
    var property = option

    return this.each(function() {
      var $this = $(this)
      var options = $.extend({}, $this.data(), typeof option === 'object' && option)
      var data = $this.data('bjui.slidebar')

      if (!data) $this.data('bjui.slidebar', (data = new Slidebar(this, options)))

      if (typeof property === 'string' && $.isFunction(data[property])) {
        [].shift.apply(args)
        if (!args) data[property]()
        else data[property].apply(data, args)
      } else {
        data.init()
      }
    })
  }

  var old = $.fn.slidebar

  $.fn.slidebar = Plugin
  $.fn.slidebar.Constructor = Slidebar

  // SLIDEBAR NO CONFLICT
  // =================

  $.fn.basedrag.noConflict = function() {
    $.fn.slidebar = old
    return this
  }

  // SLIDEBAR DATA-API
  // ==============
  $(document).one(BJUI.eventType.afterInitUI, function(e) {
    $('#bjui-leftside').slidebar({ minW: 150, maxW: 700 })
  })

  $(document).on('click.bjui.slidebar.data-api', '[data-toggle="slidebar"]', function(e) {
    var $li = $(this).parent()
    var $box = $('#bjui-accordionmenu')
    var $panels = $li.data('bjui.slidebar.hnav.panels')

    $box.find('> .panel').detach()

    if ($panels && $panels.length) {
      $box.append($panels)
      $li.addClass('active').siblings().removeClass('active')
    } else {
      Plugin.call($(this), 'initHnav')
    }

    e.preventDefault()
  })
}(jQuery))
