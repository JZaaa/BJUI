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
      this._loadMenu()
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
      this._$menuElement = $(menuContentSelector)
      this._$menuElement.html(`<ul class="sidebar-nav">${menusHtml}</ul>`)
      this._initializeSidebar()
    }

    _initializeSidebar() {
      Scrollbar.init(this._$menuElement[0])
      this._initializeSidebarCollapse()
      this._bindEventClick()
    }

    _initializeSidebarCollapse() {
      const sidebarElement = document.querySelector(menuSelector)
      const sidebarToggleElement = $(layoutHeaderSelector).find('.bjui-sidebar-toggle')[0]
      const appElement = document.querySelector('#bjui-app')

      if (sidebarElement && sidebarToggleElement) {
        sidebarToggleElement.addEventListener('click', () => {
          sidebarElement.classList.toggle('collapsed')
          appElement.classList.toggle('menu-collapsed')

          sidebarElement.addEventListener('transitionend', () => {
            window.dispatchEvent(new Event('resize'))
          })
        })
      }
    }

    _bindEventClick() {
      const _this = this
      this._$menuElement.on('click', 'a', function(e) {
        e.preventDefault()
        var $this = $(this)
        const url = $this.attr('href')
        if (url && url.length && url) {
          _this._handleMenuChange($this, url)
        }
      })
    }

    _handleMenuChange($a, url) {
      this._$menuElement.find('li').removeClass('active')
      $a.parentsUntil(this._$menuElement, 'li').addClass('active')
      $a.navtab({
        url: url || $a.attr('href')
      })
    }
  }

  // SLIDEBAR DATA-API
  // ==============
  $(document).one(BJUI.eventType.afterInitUI, function(e) {
    new Sidebar(BJUI.menus)
  })
}(jQuery))
