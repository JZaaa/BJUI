/* ========================================================================
 * B-JUI: bjui-sidebar.js  v2
 * ======================================================================== */

import createMenuHtml from '@/utils/createMenuHtml'
import Scrollbar from 'smooth-scrollbar'
import { layoutHeaderSelector, menuContentSelector, sidebarSelector } from '@/utils/static'
import { getAppHashUrl } from '@/utils/url'

(function($) {
  'use strict'

  const Default = {
    menusData: [],
    callback: null
  }

  class Sidebar {
    constructor(options) {
      this._options = $.extend({}, Default, options || {})
      this._sidebarElement = document.querySelector(sidebarSelector)
      this._appElement = document.querySelector('#bjui-app')
      this._$menuElement = $(menuContentSelector)
      this._initDom()

      this._loadMenu()
    }

    /**
     * 修改活动菜单
     * @param url url
     * @param $a
     */
    changeActiveMenu(url, $a) {
      this._handleMenuChange($a, url)
      // this._changeMenuActive(null, url)
      // this._changeHashRouter(null, url)
    }

    toggleCollapse() {
      this._sidebarElement.classList.toggle('collapsed')
      this._appElement.classList.toggle('menu-collapsed')
      this._$placeholder.toggleClass('collapsed')

      this._sidebarElement.addEventListener('transitionend', () => {
        $(window).trigger(BJUI.eventType.resizeGrid)
      })
    }

    _initDom() {
      this._$placeholder = $(`<div class="bjui-sidebar"></div>`)
      $(this._sidebarElement).before(this._$placeholder)
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
            if (callback) {
              res = callback(true, res) || res
            }
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

    /**
     * 修改活动菜单
     * @param $a 选中菜单，若无则查找url
     * @param url 当a为空时，需设置url
     * @return {*}
     * @private
     */
    _changeMenuActive($a, url) {
      if (!($a && $a.length)) {
        if (url && url.length) {
          const hashUrl = getAppHashUrl(url)
          if (this._hashUrl === hashUrl) {
            return null
          }
          $a = this._$menuElement.find(`a[data-hash="${hashUrl}"]`)
        } else {
          return null
        }
      }
      if (!($a && $a.length)) {
        return null
      }
      if ($a.length > 1) {
        $a = $a.first()
      }
      this._$menuElement.find('li').removeClass('active')
      $a.parentsUntil(this._$menuElement, 'li').addClass('active')
      $a.parentsUntil(this._$menuElement, '.collapse').collapse('show')
      return $a
    }

    /**
     * 菜单变化处理
     * @param $a
     * @param url
     * @private
     */
    _handleMenuChange($a, url) {
      $a = this._changeMenuActive($a, url)
      if ($a && $a.length) {
        const navUrl = url || $a.attr('href')
        const iframe = $a.data('iframe')
        if (iframe === 'outer') {
          window.open(navUrl, '_blank')
          return
        }
        $a.navtab({
          url: navUrl,
          external: !!iframe
        })
        if (!iframe) {
          this._changeHashRouter($a, navUrl)
        }
      }
    }

    /**
     * 修改hash
     * @param $a
     * @param navUrl
     * @private
     */
    _changeHashRouter($a, navUrl) {
      let hash
      if ($a && $a.length) {
        hash = $a.data('hash')
      }
      if (!(hash && hash.length)) {
        hash = getAppHashUrl(navUrl)
      }
      if (this._hashUrl === hash) {
        return
      }
      if (hash && hash.length) {
        this._hashUrl = hash
        location.hash = hash
      }
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
        if (!args) {
          data[property]()
        } else {
          data[property].apply(data, args)
        }
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
