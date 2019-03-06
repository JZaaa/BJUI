/*!
 * B-JUI  v1.2 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-core.js  v1.2
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.core.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-core.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+(function($) {
  'use strict'

  var BJUI = {
    version: '1.1.4',
    JSPATH: 'BJUI/',
    PLUGINPATH: 'BJUI/plugins/',
    IS_DEBUG: false,
    date: true,
    KeyPressed: { // key press state
      ctrl: false,
      shift: false
    },
    theme: 'blue',
    dialog: {
      mask: false,
      width: 500,
      height: 300
    },
    keyCode: {
      ENTER: 13, ESC: 27, END: 35, HOME: 36,
      SHIFT: 16, CTRL: 17, TAB: 9,
      LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40,
      DELETE: 46, BACKSPACE: 8
    },
    eventType: {
      initUI: 'bjui.initUI', // When document load completed or ajax load completed, B-JUI && Plugins init
      beforeInitUI: 'bjui.beforeInitUI', // If your DOM do not init [add to DOM attribute 'data-noinit="true"']
      afterInitUI: 'bjui.afterInitUI', //
      ajaxStatus: 'bjui.ajaxStatus', // When performing ajax request, display or hidden progress bar
      resizeGrid: 'bjui.resizeGrid', // When the window or dialog resize completed
      beforeAjaxLoad: 'bjui.beforeAjaxLoad', // When perform '$.fn.ajaxUrl', to do something...

      beforeLoadNavtab: 'bjui.beforeLoadNavtab',
      beforeLoadDialog: 'bjui.beforeLoadDialog',
      afterLoadNavtab: 'bjui.afterLoadNavtab',
      afterLoadDialog: 'bjui.afterLoadDialog',
      beforeCloseNavtab: 'bjui.beforeCloseNavtab',
      beforeCloseDialog: 'bjui.beforeCloseDialog',
      afterCloseNavtab: 'bjui.afterCloseNavtab',
      afterCloseDialog: 'bjui.afterCloseDialog'
    },
    pageInfo: { total: 'total', pageCurrent: 'pageCurrent', pageSize: 'pageSize', orderField: 'orderField', orderDirection: 'orderDirection' },
    alertMsg: { displayPosition: 'topcenter', displayMode: 'slide', alertTimeout: 3000 }, // 信息提示的显示位置，显隐方式，及[info/correct]方式时自动关闭延时
    ajaxTimeout: 50000,
    statusCode: { ok: 200, error: 300, timeout: 301 },
    keys: { statusCode: 'statusCode', message: 'message' },
    ui: {
      windowWidth: 0,
      showSlidebar: true, // 左侧导航栏锁定/隐藏
      clientPaging: true, // 是否在客户端响应分页及排序参数
      overwriteHomeTab: false // 当打开一个未定义id的navtab时，是否可以覆盖主navtab(我的主页)
    },
    debug: function(msg) {
      if (this.IS_DEBUG) {
        if (typeof (console) !== 'undefined') console.log(msg)
        else alert(msg)
      }
    },
    loginInfo: {
      url: 'login.html',
      title: 'Login',
      width: 420,
      height: 260,
      mask: true
    },
    loadLogin: function() {
      var login = this.loginInfo

      $('body').dialog({ id: 'bjui-login', url: login.url, title: login.title, width: login.width, height: login.height, mask: login.mask })
    },
    /**
     * 初始化
     * 可配置项:
     *  [object]  pageInfo, statusCode, alertMsg, loginInfo, ui, dialog
     *  [string] JSPATH, PLUGINPATH, ajaxTimeout, debug, theme
     * @param options
     */
    init: function(options) {
      var op = $.extend({}, options)

      $.extend(BJUI.statusCode, op.statusCode)
      $.extend(BJUI.pageInfo, op.pageInfo)
      $.extend(BJUI.alertMsg, op.alertMsg)
      $.extend(BJUI.loginInfo, op.loginInfo)
      $.extend(BJUI.ui, op.ui)
      $.extend(BJUI.dialog, op.dialog)

      if (op.JSPATH) this.JSPATH = op.JSPATH
      if (op.PLUGINPATH) this.PLUGINPATH = op.PLUGINPATH
      if (op.ajaxTimeout) this.ajaxTimeout = op.ajaxTimeout
      this.date = (op.date === undefined) ? this.date : op.date

      this.IS_DEBUG = op.debug || false
      this.theme = $.cookie('bjui_theme') || op.theme
      this.initEnv()
      if (this.date) this.initDate()

      $(this).theme('setTheme', this.theme)
    },
    initEnv: function() {
      $(window).resize(function() {
        var ww = $(this).width()

        if (BJUI.ui.windowWidth) {
          if (BJUI.ui.windowWidth > 600 && BJUI.ui.windowWidth < ww) { ww = BJUI.ui.windowWidth }
        }

        BJUI.initLayout(ww)
        setTimeout(function() { $(this).trigger(BJUI.eventType.resizeGrid) }, 30)
      })

      setTimeout(function() {
        var ww = $(window).width()

        if (BJUI.ui.windowWidth) {
          if (BJUI.ui.windowWidth > 600 && BJUI.ui.windowWidth < ww) { ww = BJUI.ui.windowWidth }
        }

        BJUI.initLayout(ww)
        $(document).initui()
      }, 10)
    },
    initLayout: function(ww) {
      var $header = $('#bjui-header')
      var $navtab = $('#bjui-navtab')
      var iContentW = ww - (BJUI.ui.showSlidebar ? $('#bjui-sidebar').width() + 6 : 6)

      var iContentH = $(window).height() - $header.height() - $('#bjui-footer').outerHeight()

      var navtabH = $navtab.find('.tabsPageHeader').height()

      if (BJUI.ui.windowWidth) $('#bjui-window').width(ww)
      BJUI.windowWidth = ww

      $('#bjui-container').height(iContentH)
      $navtab.width(iContentW)
      $('#bjui-leftside, #bjui-sidebar, #bjui-sidebar-s, #bjui-splitBar, #bjui-splitBarProxy').css({ height: '100%' })
      $('#bjui-navtab .tabsPageContent').height(iContentH - navtabH)

      /* fixed pageFooter */
      setTimeout(function() {
        $('#bjui-navtab > .tabsPageContent > .navtabPage').resizePageH().find('.bjui-layout').resizePageH()
      }, 10)

      /* header navbar */
      var navbarWidth = $('body').data('bjui.navbar.width')

      var $toggle = $header.find('.bjui-navbar-toggle')
      var $logo = $header.find('.bjui-navbar-logo')
      var $navbar = $('#bjui-navbar-collapse')
      var $nav = $navbar.find('.bjui-navbar-right')

      if (!navbarWidth) {
        navbarWidth = { logoW: $logo.outerWidth(), navW: $nav.outerWidth() }
        $('body').data('bjui.navbar.width', navbarWidth)
      }
      if (navbarWidth) {
        if (ww - navbarWidth.logoW < navbarWidth.navW) {
          $toggle.show()
          $navbar.addClass('collapse menu')
        } else {
          $toggle.hide()
          $navbar.removeClass('collapse menu in')
        }
      }
      /* horizontal navbar */
      var $hnavbox = $('#bjui-hnav-navbar-box')

      var $hnavbar = $hnavbox.find('> #bjui-hnav-navbar')

      var $hmoreL = $hnavbox.prev()

      var $hmoreR = $hnavbox.next()

      var hboxWidth = $hnavbox.width()

      var liW = 0

      $hnavbar.find('> li').each(function(i) {
        var $li = $(this)

        liW += $li.outerWidth()

        if (liW > hboxWidth) {
          $hmoreR.show()
          $hnavbox.data('hnav.move', true).data('hnav.liw', liW)
        } else {
          $hmoreL.hide()
          $hmoreR.hide()
          $hnavbox.removeData('hnav.move')
        }
      })
    },
    regional: {},
    setRegional: function(key, value) {
      BJUI.regional[key] = value
    },
    getRegional: function(key) {
      if (String(key).indexOf('.') >= 0) {
        var msg
        var arr = String(key).split('.')

        for (var i = 0; i < arr.length; i++) {
          if (!msg) msg = BJUI.regional[arr[i]]
          else msg = msg[arr[i]]
        }

        return msg
      } else {
        return BJUI.regional[key]
      }
    },
    doRegional: function(frag, regional) {
      $.each(regional, function(k, v) {
        frag = frag.replaceAll('#' + k + '#', v)
      })

      return frag
    },
    initDate: function() {
      // 时钟
      var today = new Date()
      $('#bjui-date').html(today.formatDate('yyyy/MM/dd'))
      setInterval(function() {
        today = new Date(today.setSeconds(today.getSeconds() + 1))
        $('#bjui-clock').html(today.formatDate('HH:mm:ss'))
      }, 1000)
    },
    // 清除遮罩层
    removeProgress: function() {
      var $box = $(document)
      $box.find('.bjui-maskProgress').find('.progress').stop().animate({ width: '100%' }, 'fast', function() {
        $box.find('.bjui-ajax-mask').fadeOut('normal', function() { $(this).remove() })
      })
    }
  }

  window.BJUI = BJUI
}(jQuery))
