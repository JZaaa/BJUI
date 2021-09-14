/*!
 * B-JUI  v1.2 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-sidebar.js  v1.2
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.barDrag.js (author:Roger Wu)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-sidebar.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

import createMenuHtml from '@/utils/createMenuHtml'
import Scrollbar from 'smooth-scrollbar'
import { layoutHeaderSelector, menuContentSelector, menuSelector } from '@/utils/static'

(function($) {
  'use strict'

  const Default = {
    menusData: [],
    callback: null
  }

  class Sidebar {
    constructor(options) {
      this._options = $.extend({}, Default, options || {})
      this._sidebarElement = document.querySelector(menuSelector)
      this._appElement = document.querySelector('#bjui-app')
      this._$menuElement = $(menuContentSelector)
      this._baseUrl = XEUtils.getBaseURL()

      this._loadMenu()
    }

    /**
     * 修改活动菜单
     * @param $a
     * @param {undefined|string} url
     */
    changeActiveMenu($a, url) {
      this._handleMenuChange($a, url)
    }

    toggleCollapse() {
      this._sidebarElement.classList.toggle('collapsed')
      this._appElement.classList.toggle('menu-collapsed')

      this._sidebarElement.addEventListener('transitionend', () => {
        window.dispatchEvent(new Event('resize'))
      })
    }

    _loadMenu() {
      const menusData = this._options.menusData || []
      const callback = this._options.callback
      if (typeof menusData === 'string') {
        $('body').Loading({
          zIndex: 9999,
          background: '#fff'
        })
        $.ajax({
          type: 'get',
          cache: false,
          url: menusData,
          dataType: 'json',
          success: (res) => {
            callback && callback(true, res)
            this._initMenu(res)
          },
          error: function() {
            callback && callback(false)
          },
          complete: function() {
            $('body').Loading('dispose')
          }
        })
      } else {
        this._initMenu(menusData)
      }
    }

    _initMenu(menusData) {
      const menusHtml = createMenuHtml(menusData)
      this._$menuElement.html(`<ul class="sidebar-nav">${menusHtml}</ul>`)
      this._initializeSidebar()
      this._initializeSidebarCollapse()

      this._initLoad()

      this._bindRouter()
      this._bindEventClick()
    }

    _initializeSidebar() {
      Scrollbar.init(this._$menuElement[0])
    }

    _initializeSidebarCollapse() {
      const sidebarToggleElement = $(layoutHeaderSelector).find('.bjui-sidebar-toggle')[0]
      if (this._sidebarElement && sidebarToggleElement) {
        sidebarToggleElement.addEventListener('click', () => {
          this.toggleCollapse()
        })
      }
    }

    _bindEventClick() {
      const that = this
      this._$menuElement.on('click', 'a', function(e) {
        e.preventDefault()
        var $this = $(this)
        const url = $this.attr('href')
        if (url && url.length && url) {
          that._handleMenuChange($this, url)
        }
      })
    }

    _handleMenuChange($a, url) {
      if ($a.length > 1) {
        $a = $a.first()
      }
      this._$menuElement.find('li').removeClass('active')
      $a.parentsUntil(this._$menuElement, 'li').addClass('active')
      $a.parentsUntil(this._$menuElement, '.collapse').collapse('show')
      const navUrl = url || $a.attr('href')
      $a.navtab({
        url: navUrl
      })
      this._changeHashRouter(navUrl)
    }

    /**
     * 修改hash
     * @param navUrl
     * @private
     */
    _changeHashRouter(navUrl) {
      let hash = navUrl
      if (XEUtils.startsWith(hash, 'http')) {
        hash = hash.trim(this._baseUrl, 'left')
      }
      if (!XEUtils.startsWith(hash, '/')) {
        hash = '/' + hash
      }
      hash = '#' + hash
      this._hashUrl = hash
      location.hash = hash
    }

    /**
     * 监听router变化
     * @private
     */
    _bindRouter() {
      window.addEventListener('hashchange', () => {
        const hash = location.hash
        if (this._hashUrl && this._hashUrl !== hash) {
          const $a = this._$menuElement.find(`a[data-hash="${hash}"]`)
          if ($a.length) {
            this._handleMenuChange($a)
          }
        }
      })
    }

    _initLoad() {
      const $menuElement = this._$menuElement
      const locat = XEUtils.locat()
      let url
      if (locat.searchQuery && locat.searchQuery.redirect && locat.searchQuery.redirect.length) {
        // redirect参数跳转
        url = locat.searchQuery.redirect
        const $active = $menuElement.find(`a[href=${url}]`).first()
        if ($active.length) {
          return this._handleMenuChange($active, url)
        }
      } else if (locat.hash && locat.hash.length) {
        // hash 跳转
        const $a = this._$menuElement.find(`a[data-hash="${locat.hash}"]`)
        if ($a.length) {
          return this._handleMenuChange($a)
        }
      }

      this._handleMenuChange($menuElement.find('a[href]').first())
    }
  }

  // SIDEBAR PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    var args = arguments
    var property = option

    return this.each(function() {
      var $this = $(this)
      var options = $.extend({}, $this.data(), typeof option === 'object' && option)
      var data = $this.data('bjui.sidebar')

      if (!data) $this.data('bjui.sidebar', (data = new Sidebar(options)))

      if (typeof property === 'string' && $.isFunction(data[property])) {
        [].shift.apply(args)
        if (!args) data[property]()
        else data[property].apply(data, args)
      }
    })
  }

  var old = $.fn.sidebar

  $.fn.sidebar = Plugin
  $.fn.sidebar.Constructor = Sidebar

  // SLIDEBAR NO CONFLICT
  // =================

  $.fn.basedrag.noConflict = function() {
    $.fn.sidebar = old
    return this
  }

  // SLIDEBAR DATA-API
  // ==============
  $(document).one(BJUI.eventType.afterInitUI, function(e) {
    $(menuContentSelector).sidebar(BJUI.menus)
  })
}(jQuery))
