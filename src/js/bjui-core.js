/*!
 * B-JUI  v2 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-core.js  v2
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
    version: __VERSION__,
    JSPATH: 'BJUI/',
    PLUGINPATH: 'BJUI/plugins/',
    IS_DEBUG: false,
    KeyPressed: { // key press state
      ctrl: false,
      shift: false
    },
    theme: 'blue',
    menus: {
      menusData: [],
      callback: null
    }, // 菜单数据
    dialog: {
      mask: true,
      width: 500,
      height: 300
    },
    // 编辑器统一配置
    KindEditor: {
      uploadJson: undefined,
      fileManagerJson: undefined
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
    statusCode: { ok: 200, error: 300, timeout: 401 },
    keys: { statusCode: 'statusCode', message: 'message' },
    ui: {
      clientPaging: true // 是否在客户端响应分页及排序参数
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
      $.extend(BJUI.KindEditor, op.KindEditor)
      $.extend(BJUI.dialog, op.dialog)
      $.extend(BJUI.menus, op.menus)

      if (op.JSPATH) this.JSPATH = op.JSPATH
      if (op.PLUGINPATH) this.PLUGINPATH = op.PLUGINPATH
      if (op.ajaxTimeout) this.ajaxTimeout = op.ajaxTimeout

      this.IS_DEBUG = op.debug || false
      this.initEnv()
    },
    initEnv: function() {
      $(window).resize(function() {
        var ww = $(this).width()

        BJUI.initLayout(ww)
        setTimeout(function() { $(this).trigger(BJUI.eventType.resizeGrid) }, 30)
      })

      setTimeout(function() {
        var ww = $(window).width()

        BJUI.initLayout(ww)
        $(document).initui()
      }, 10)
    },
    initLayout: function() {
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
    }
  }

  window.BJUI = BJUI
}(jQuery))
