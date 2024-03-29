/**
 * 其他布局模式
 */

+(function ($) {
  'use strict'

  var Layout = function () {
    this._$ul = $('#bjui-hnav-navbar')
    this._$sidebar = $('#bjui-sidebar')
    this._menus = []
    this._initUi()
    this._getMenusData(this._$ul, [], 1)
    $('#bjui-hnav').remove()
    $('#bjui-splitBar').remove()
    this._bindEvent()
    var html = this._createMenuHtml(this._menus, '#bjui-sidebar__menu')
    this._$sidebar.html('<ul class="bjui-sidebar" id="bjui-sidebar__menu">' + html + '<ul>')


    function _initActiveMenu($sidebar) {
      var $box = $('#bjui-navtab')
      var $tabs = $box.find('.navtab-tab')
      var $main = $tabs.find('li:first')
      if ($main.length) {
        var url = $main.data('url')
        if (url) {
          var activeMenu = $sidebar.find('a[data-url="'+url+'"]:first')
          if (activeMenu.length) {
            activeMenu.parents('.sidebar-item').addClass('active')
            var text = activeMenu.text()
            var $moreBox = $box.find('.tabsMoreList')
            $moreBox.find('li:first a').text(text)
            $main.find('span').text(text)
          }
        }
      }
    }

    _initActiveMenu(this._$sidebar)
  }

  Layout.prototype._initUi = function () {
    var styleObj = BJUI.layout.style
    if (!styleObj) {
      return
    }
    var style = ''


    if (styleObj.headerBg) {
      style += '#bjui-header{background: ' + styleObj.headerBg + '!important}'
    }
    if (styleObj.sidebarBg) {
      style += '#bjui-sidebar{background: ' + styleObj.sidebarBg + '}'
    }

    if (styleObj.sidebarLightBg) {
      style += '.bjui-sidebar .sidebar-dropdown .sidebar-link{background: ' + styleObj.sidebarLightBg + '}'
    }

    if (styleObj.activeLinkBg) {
      style += '.bjui-sidebar .sidebar-item.active>.sidebar-link:not([data-toggle=collapse]){background: '+ styleObj.activeLinkBg +'}'
    }

    if (styleObj.activeLinkBorderLeftColor) {
      style += '.bjui-sidebar .sidebar-item.active>.sidebar-link:not([data-toggle=collapse]){border-left-color: '+ styleObj.activeLinkBorderLeftColor +'}'
    }

    $('head').append('<style>'+ style +'</style>')
  }

  Layout.prototype._bindEvent = function () {
    var that = this
    this._$sidebar.on('click', '[data-toggle="navtab"]', function () {
      var $this = $(this)
      that._$sidebar.find('li').removeClass('active')
      $this.parentsUntil(that._$sidebar, 'li').addClass('active')
    })
  }


  Layout.prototype._getMenusData = function ($ulSelector, parent, level) {
    var that = this
    $ulSelector.children('li').each(function () {
      var $children = $(this)
      return $children.children('a').each(function () {
        var $that = $(this)
        var $menuItems = $children.children('ul')
        var item = {
          name: $that.text(),
          path: 'javascript:',
          icon: $that.data('icon'),
          target: $that.attr('target'),
          data: {},
          children: []
        }
        if ($menuItems.length) {
          that._getMenusData($menuItems, item.children, level + 1)
        } else {
          item.data = $that.data() || {}
          item.path = $that.attr('href')
        }
        if (level === 1) {
          var icon = $that.children('i')
          if (icon.length) {
            item.icon = icon.first().attr('class')
          }
          that._menus.push(item)
        } else {
          parent.push(item)
        }
      })
    })
  }

  Layout.prototype._createMenuHtml = function (treeData, parentSelector) {
    var html = ''
    var that = this
    var isPanel = BJUI.layout.panel ? 'panel' : ''
    treeData.forEach(function (val) {
      html += '<li class="sidebar-item '+ (isPanel) +'">'
      var icon = ''
      if (val.icon && val.icon.length) {
        icon = '<div class="sidebar-item__icon"><i class="align-middle ' + val.icon + '"></i></div>'
      }
      if (val.children && val.children.length) {
        var id = $.getGUID()

        html +=
          '<a data-target="#' + id + '" data-toggle="collapse" class="sidebar-link collapsed">' + icon +
          '<span class="align-middle">' + val.name + '</span></a>'
        html += '<ul id="' + id + '" class="sidebar-dropdown list-unstyled collapse" data-parent="' + parentSelector + '">'
        html += that._createMenuHtml(val.children, '#' + id)
        html += '</ul>'
      } else {
        var attr = ''
        var dataItem = val.data
        if (val.path && val.path.length) {
          attr = ' data-url="' + val.path + '" data-load-page-data="false"'
          if (dataItem && dataItem.link) {
            attr = ' href="' + val.path + '"'
            if (val.target) {
              attr += ' target="' + val.target + '"'
            }
          } else {
            attr += ' data-toggle="navtab"'
          }
        }
        if (dataItem) {
          delete dataItem.url
          delete dataItem.path
          for (var i in dataItem) {
            if (dataItem.hasOwnProperty(i)) {
              if (typeof dataItem[i] === 'string') {
                attr += ' data-' + i + '="' + dataItem[i] + '"'
              }
            }
          }
        }
        html +=
          '<a class="sidebar-link" ' + attr + '>' + icon +
          '<span class="align-middle">' + val.name + '</span></a>'
      }
      html += '</li>'
    })
    return html
  }


  $(document).one(BJUI.eventType.afterInitUI, function (e) {
    if (BJUI.layout && BJUI.layout.mode !== 'default') {
      new Layout()
    }
  })

}(jQuery))
