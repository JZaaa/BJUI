/*!
 * B-JUI   (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-navtab.js
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.navTab.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-navtab.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

import { menuContentSelector, navTabContainerSelect } from '@/utils/static'
import { getAppHashUrl } from '@/utils/url'

+(function($) {
  'use strict'

  // NAVTAB GLOBAL ELEMENTS
  // ======================

  var $box
  var autorefreshTimer

  $(function() {
    var INIT_NAVTAB = function() {
      $box = $(navTabContainerSelect)
    }

    INIT_NAVTAB()
  })

  // NAVTAB CLASS DEFINITION
  // ======================

  var Navtab = function(element, options) {
    this.$element = $(element)
    options.hash = getAppHashUrl(options.url)
    this.options = options
    this.tools = this.TOOLS()
  }

  Navtab.DEFAULTS = {
    id: 'main',
    title: 'New tab',
    history: true, // 是否记录路由器hash值
    url: undefined,
    type: 'GET',
    data: {},
    loadingmask: true,
    fresh: false,
    autorefresh: false,
    onLoad: null
  }

  Navtab.prototype.TOOLS = function() {
    var that = this
    return {
      getDefaults: function() {
        return Navtab.DEFAULTS
      },
      reload: function($panel, flag) {
        flag = flag || $panel.data('reloadFlag')

        var options = $panel.data('options')

        if (flag) {
          $panel.data('reloadFlag', false)
          if ($panel.hasClass('external')) {
            that.openExternal(options.url, $panel)
          } else {
            that.tools.reloadTab($panel, options)
          }
        }
      },
      reloadTab: function($panel, options) {
        var onLoad = options.onLoad ? options.onLoad.toFunc() : null

        var arefre = options.autorefresh && (isNaN(String(options.autorefresh)) ? 15 : options.autorefresh)

        if (options.data) {
          options.data = (typeof options.data === 'object') ? options.data : options.data.toObj()
        }

        $panel
          .trigger(BJUI.eventType.beforeLoadNavtab)
          .ajaxUrl({
            type: (options.type || 'GET'),
            url: options.url,
            data: options.data || {},
            loadingmask: options.loadingmask,
            callback: function(response) {
              $(menuContentSelector).sidebar('changeActiveMenu', options.url)
              if (history) {
                location.hash = getAppHashUrl(options.url)
              }
              if (onLoad) onLoad.apply(that, [$panel])
              if (autorefreshTimer) clearInterval(autorefreshTimer)
              if (arefre) {
                autorefreshTimer = setInterval(function() {
                  $panel.navtab('refresh')
                }, arefre * 1000)
              }
              if (BJUI.ui.clientPaging && $panel.data('bjui.clientPaging')) $panel.pagination('setPagingAndOrderby', $panel)
            }
          })
      }
    }
  }

  // if found tabid replace tab, else create a new tab.
  Navtab.prototype.openTab = function() {
    var $element = this.$element
    var options = this.options
    var tools = this.tools

    if (!options.url && options.href) options.url = options.href
    if (!options.url) {
      BJUI.debug('Navtab Plugin: Error trying to open a navtab, url is undefined!')
      return
    } else {
      options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))

      if (!options.url.isFinishedTm()) {
        $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg.replace('#plhmsg#', BJUI.regional.plhmsg)))
        BJUI.debug('Navtab Plugin: The new navtab\'s url is incorrect, url: ' + options.url)
        return
      }

      options.url = encodeURI(options.url)
    }

    if (!options.id) {
      options.id = 'main'
    }
    BJUI.ModuleFixed.destroyModules($.CurrentNavtab)
    var $panel
    $panel = $('<div class="navtabPage unitBox bjui-navtab-content"></div>')
    $panel.data('options', options).data('initOptions', options)
    $box.empty()
    $panel.appendTo($box)

    if (options.external || (options.url && options.url.isExternalUrl())) {
      this.openExternal(options.url, $panel)
    } else {
      tools.reloadTab($panel, options)
    }
    $.CurrentNavtab = $panel
  }

  Navtab.prototype.refresh = function(tabid) {
    const $panel = $.CurrentNavtab
    $panel.removeData('bjui.clientPaging')

    this.reload($panel.data('initOptions'))
  }

  Navtab.prototype.reload = function(option, initOptionFlag) {
    const that = this
    const $panel = $.CurrentNavtab
    const options = $.extend({}, typeof option === 'object' && option)
    var initOptions = $panel.data('initOptions') || {}
    var op = $.extend({}, initOptions, options)
    var _reload = function() {
      if (!initOptionFlag) $panel.data('initOptions', op)
      $panel.data('options', op)
      that.tools.reload($panel, true)
    }

    if (options.reloadWarn) {
      this.$element.alertmsg('confirm', options.reloadWarn, {
        okCall: function() {
          _reload()
        }
      })
    } else {
      _reload()
    }
  }

  Navtab.prototype.reloadForm = function(clearQuery, option) {
    var options = $.extend({}, typeof option === 'object' && option)
    const $panel = $.CurrentNavtab

    if ($panel.length) {
      if (!$panel.hasClass('external')) {
        var $pagerForm = $panel.find('#pagerForm')
        var data = {}
        var pageData = {}

        if ($pagerForm.attr('action')) options.url = $pagerForm.attr('action')
        if ($pagerForm && $pagerForm.length) {
          pageData = $pagerForm.serializeJson()
          if (!option || !option.type) options.type = $pagerForm.attr('method') || 'POST'
          if (clearQuery) {
            var pageInfo = BJUI.pageInfo

            /* 修复navtab清空查询对排序无效bug */
            pageData[pageInfo['orderDirection']] = pageData[pageInfo['orderField']] = ''
            if ($panel.data('bjui.clientPaging')) {
              $panel.data('bjui.clientPaging').orderDirection = $panel.data('bjui.clientPaging').orderField = ''
            }
            /* end */
            for (var key in pageInfo) {
              if (pageInfo.hasOwnProperty(key)) {
                data[pageInfo[key]] = pageData[pageInfo[key]]
              }
            }
          } else {
            data = pageData
          }
          options.data = $.extend({}, options.data || {}, data)
        }
      }
      this.reload(options, true)
    }
  }

  Navtab.prototype.openExternal = function(url, $panel) {
    const ih = $panel.height() - 5
    $panel.Loading({
      absolute: false,
      tip: BJUI.regional.progressmsg
    }, 'open')
    const iframe = document.createElement('iframe')
    iframe.style.width = '100%'
    iframe.style.height = `${ih}px`
    iframe.src = url
    iframe.style.border = 'none'
    iframe.onload = function() {
      $panel.Loading('close')
    }
    $panel.after(iframe)
  }

  // NAVTAB PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    var args = arguments
    var property = option

    return this.each(function() {
      var $this = $(this)
      var options = $.extend({}, Navtab.DEFAULTS, typeof option === 'object' && option)
      var data = $this.data('bjui.navtab')

      if (!data) $this.data('bjui.navtab', (data = new Navtab(this, options)))

      if (typeof property === 'string' && $.isFunction(data[property])) {
        [].shift.apply(args)
        if (!args) {
          data[property]()
        } else {
          data[property].apply(data, args)
        }
      } else {
        data = new Navtab(this, options)
        data.openTab()
      }
    })
  }

  var old = $.fn.navtab

  $.fn.navtab = Plugin
  $.fn.navtab.Constructor = Navtab

  // NAVTAB NO CONFLICT
  // =================

  $.fn.navtab.noConflict = function() {
    $.fn.navtab = old
    return this
  }

  // NAVTAB DATA-API
  // ==============

  $(document).on('click.bjui.navtab.data-api', '[data-toggle="navtab"]', function(e) {
    var $this = $(this)
    var href = $this.attr('href')
    var data = $this.data()
    var options = data.options
    if (options) {
      if (typeof options === 'string') options = options.toObj()
      if (typeof options === 'object') {
        $.extend(data, options)
      }
    }

    if (!data.title) data.title = $this.text()
    if (href && !data.url) data.url = href

    Plugin.call($this, data)

    e.preventDefault()
  })
}(jQuery))
