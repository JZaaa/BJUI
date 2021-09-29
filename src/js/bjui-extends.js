/*!
 * B-JUI  v2.0
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-extends.js  v2.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.core.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-extends.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

import { navTabContainerSelect } from '@/utils/static'

+(function($) {
  'use strict'

  $.fn.extend({
    /**
     *  @param {Object} op: {type:GET/POST, url:ajax请求地址, data:ajax请求参数列表, callback:回调函数 }
     */
    ajaxUrl: function(op) {
      var $this = $(this)

      $this.trigger(BJUI.eventType.beforeAjaxLoad)

      if (op.loadingmask) {
        $this.trigger(BJUI.eventType.ajaxStatus)
      }

      $.ajax({
        type: op.type || 'GET',
        url: op.url,
        data: op.data || {},
        cache: false,
        dataType: 'html',
        timeout: BJUI.ajaxTimeout,
        success: function(response) {
          var json = response.toJson()
          if (!json[BJUI.keys.statusCode]) {
            $this.empty().html(response).initui()
            if ($.isFunction(op.callback)) op.callback(response)
          } else {
            if (json[BJUI.keys.statusCode] === BJUI.statusCode.error) {
              if (json[BJUI.keys.message]) $this.alertmsg('error', json[BJUI.keys.message])
              if (!$this.closest('.bjui-layout').length) {
                if ($this.hasClass('dialogContent')) $this.dialog('closeCurrent')
              }
            } else if (json[BJUI.keys.statusCode] === BJUI.statusCode.timeout) {
              if ($this.hasClass('dialogContent')) $this.dialog('closeCurrent')

              $('body').alertmsg('info', (json[BJUI.keys.message] || BJUI.regional.sessiontimeout))
              BJUI.loadLogin()
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          $this.bjuiajax('ajaxError', xhr, ajaxOptions, thrownError)
          if (!$this.closest('.bjui-layout').length) {
            if ($this.hasClass('dialogContent')) $this.dialog('closeCurrent')
          }
          $this.trigger('bjui.ajaxError')
        },
        statusCode: {
          503: function(xhr, ajaxOptions, thrownError) {
            $this.alertmsg('error', FRAG.statusCode_503.replace('#statusCode_503#', BJUI.regional.statusCode_503) || thrownError)
          },
          // 添加 httpCode 403 超时弹框
          403: function(xhr, ajaxOptions, thrownError) {
            $this.alertmsg('error', '登录超时' || thrownError)
            BJUI.loadLogin()
          },
          // 添加 httpCode 401 无权限
          401: function(xhr, ajaxOptions, thrownError) {
            if (!BJUI.IS_DEBUG) {
              $this.alertmsg('error', '无权限访问' || thrownError)
            }
          },
          404: function(xhr, ajaxOptions, thrownError) {
            if (!BJUI.IS_DEBUG) {
              $this.alertmsg('error', ' httpCode: 404 .请求未找到！' || thrownError)
            }
          },
          500: function(xhr, ajaxOptions, thrownError) {
            if (!BJUI.IS_DEBUG) {
              $this.alertmsg('error', ' httpCode: 500 .请求失败！' || thrownError)
            }
          }
        }
      })
    },
    loadUrl: function(url, data, callback) {
      $(this).ajaxUrl({ url: url, data: data, callback: callback })
    },
    doAjax: function(op) {
      var $this = $(this)
      var $target
      var $ajaxMask

      if (!op.url) {
        BJUI.debug('The ajax url is undefined!')
        return
      }
      if (!op.callback) {
        BJUI.debug('The ajax callback is undefined!')
        return
      } else {
        op.callback = op.callback.toFunc()
      }
      if (op.loadingmask) {
        $target = $this.getPageTarget()
        $target.trigger(BJUI.eventType.ajaxStatus)
        $ajaxMask = $target.data('bj.loading')
      }
      if (!op.type) op.type = 'POST'
      if (!op.dataType) op.dataType = 'json'
      if (!op.cache) op.cache = false
      op.timeout = BJUI.ajaxTimeout
      op.success = function(response) {
        if ($ajaxMask) {
          if (op.callback) {
            $.when(op.callback(response)).done(function() {
              $target.trigger('bjui.ajaxStop')
            })
          } else {
            $target.trigger('bjui.ajaxStop')
          }
        } else {
          op.callback(response)
        }
      }
      op.error = op.error || function(xhr, ajaxOptions, thrownError) {
        $this.bjuiajax('ajaxError', xhr, ajaxOptions, thrownError)
      }

      $.ajax(op).fail(() => {
        if ($ajaxMask) {
          $target.trigger('bjui.ajaxError')
        }
      })
    },
    getPageTarget: function() {
      var $target
      if (this.closest('.bjui-layout').length) {
        $target = this.closest('.bjui-layout')
      } else if (this.closest(navTabContainerSelect).length) {
        $target = $.CurrentNavtab
      } else {
        $target = $.CurrentDialog
      }

      return $target
    },
    resizePageH: function() {
      return this.each(function() {
        if ($(this).closest('.tab-content').length) return

        var $box = $(this)
        if ($box.is(':hidden')) {
          return
        }

        const $pageHeader = $box.find('> .bjui-pageHeader')
        const $pageContent = $box.find('> .bjui-pageContent')

        const $pageFooter = $box.find('> .bjui-pageFooter')

        let headH = $pageHeader.outerHeight() || 0

        let footH = $pageFooter.outerHeight() || 0

        if ($box.hasClass('navtabPage') && $box.is(':hidden')) {
          $box.show()
          headH = $pageHeader.outerHeight() || 0
          footH = $pageFooter.outerHeight() || 0
          $box.hide()
        }
        if ($pageFooter.css('bottom')) footH += parseInt($pageFooter.css('bottom')) || 0
        if (footH === 0 && $box.hasClass('dialogContent')) {
          footH = 5
        }
        // 撑开
        const fullPage = $pageContent.hasClass('full-page')
        // 如果存在pageHeader与pageFooter
        if ($box.hasClass('bjui-layout')) {
          // 局部加载处理
          $pageContent.css({
            position: 'absolute',
            left: 0,
            right: 0,
            top: headH,
            bottom: footH,
            overflowY: 'auto'
          })
        } else if ($box.hasClass('dialogContent')) {
          // dialog处理
          $pageContent.css({
            position: 'absolute',
            left: 0,
            right: 0,
            top: headH,
            bottom: footH,
            overflowY: 'auto'
          })
        } else {
          // navtab处理
          if (headH || fullPage) {
            $pageContent.css({
              position: 'absolute',
              left: 0,
              right: 0,
              top: headH,
              bottom: footH,
              overflowY: 'auto'
            })
          } else if (footH) {
            $box.css({
              position: 'absolute',
              left: 0,
              right: 0,
              top: headH,
              bottom: footH,
              overflowY: 'auto'
            })
          }
        }
      })
    },
    getMaxIndexObj: function($elements) {
      var zIndex = 0
      var index = 0

      $elements.each(function(i) {
        var newZIndex = parseInt($(this).css('zIndex')) || 1

        if (zIndex < newZIndex) {
          zIndex = newZIndex
          index = i
        }
      })

      return $elements.eq(index)
    },
    /**
     * 将表单数据转成JSON对象 用法：$(form).serializeJson() Author: K'naan
     */
    serializeJson: function() {
      var o = {}
      var a = this.serializeArray()

      $.each(a, function() {
        if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]]
          }
          o[this.name].push(this.value || '')
        } else {
          o[this.name] = this.value || ''
        }
      })

      return o
    },
    isTag: function(tn) {
      if (!tn) return false
      if (!$(this).prop('tagName')) return false
      return $(this)[0].tagName.toLowerCase() === tn
    },
    /**
     * 判断当前元素是否已经绑定某个事件
     * @param {Object} type
     */
    isBind: function(type) {
      var _events = $(this).data('events')
      return _events && type && _events[type]
    },
    /**
     * 输出firebug日志
     * @param {Object} msg
     */
    log: function(msg) {
      return this.each(function() {
        if (console) console.log('%s: %o', msg, this)
      })
    }
  })

  /**
   * 扩展String方法
   */
  $.extend(String.prototype, {
    isPositiveInteger: function() {
      return (new RegExp(/^[1-9]\d*$/).test(this))
    },
    includeChinese: function() {
      return (new RegExp(/[\u4E00-\u9FA5]/).test(this))
    },
    /**
     * 去除指定字符
     * @param char 待去除字符
     * @param type 类型, left/right/undefined
     */
    trim: function(char, type) {
      if (!char) {
        char = 's'
      }
      if (type === 'left') {
        return this.replace(new RegExp('^\\' + char + '+', 'g'), '')
      } else if (type === 'right') {
        return this.replace(new RegExp('\\' + char + '+$', 'g'), '')
      }
      return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '')
    },
    startsWith: function(pattern) {
      return this.indexOf(pattern) === 0
    },
    endsWith: function(pattern) {
      var d = this.length - pattern.length
      return d >= 0 && this.lastIndexOf(pattern) === d
    },
    replaceSuffix: function(index) {
      return this.replace(/\[[0-9]+\]/, '[' + index + ']').replace('#index#', index)
    },
    replaceSuffix2: function(index) {
      return this.replace(/\-(i)([0-9]+)$/, '-i' + index).replace('#index#', index)
    },
    replaceAll: function(os, ns) {
      return this.replace(new RegExp(os, 'gm'), ns)
    },
    /* 替换占位符为对应选择器的值*/ // {^(.|\#)[A-Za-z0-9_-\s]*}
    replacePlh: function($box) {
      $box = $box || $(document)
      return this.replace(/{\/?[^}]*}/g, function($1) {
        var $input = $box.find($1.replace(/[{}]+/g, ''))

        return $input && $input.val() ? $input.val() : $1
      })
    },
    replaceMsg: function(holder) {
      return this.replace(new RegExp('({.*})', 'g'), holder)
    },
    isFinishedTm: function() {
      return !(new RegExp('{\/?[^}]*}').test(this))
    },
    skipChar: function(ch) {
      if (!this || this.length === 0) return ''
      if (this.charAt(0) === ch) return this.substring(1).skipChar(ch)
      return this
    },
    isUrl: function() {
      return (new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(this))
    },
    isExternalUrl: function() {
      return this.isUrl() && this.indexOf('://' + document.domain) === -1
    },
    toBool: function() {
      return (this.toLowerCase() === 'true')
    },
    toJson: function() {
      var json = this

      try {
        if (typeof json === 'object') json = json.toString()
        if (!json.trim().match('^\{(.+:.+,*){1,}\}$')) {
          return this
        } else {
          return JSON.parse(this)
        }
      } catch (e) {
        return this
      }
    },
    toObj: function() {
      var obj = null

      try {
        obj = (new Function('return ' + this))()
      } catch (e) {
        obj = this
        BJUI.debug('String toObj：Parse "String" to "Object" error! Your str is: ' + this)
      }
      return obj
    },
    /**
     * String to Function
     * 参数(方法字符串或方法名)： 'function(){...}' 或 'getName' 或 'USER.getName' 均可
     * Author: K'naan
     */
    toFunc: function() {
      if (!this || this.length === 0) return undefined
      // if ($.isFunction(this)) return this

      if (this.startsWith('function')) {
        return (new Function('return ' + this))()
      }

      var m_arr = this.split('.')
      var fn = window

      for (var i = 0; i < m_arr.length; i++) {
        fn = fn[m_arr[i]]
      }

      if (typeof fn === 'function') {
        return fn
      }

      return undefined
    },
    setUrlParams: function(obj) {
      let url = this
      for (const i in obj) {
        if (obj.hasOwnProperty(i)) {
          url = url.setUrlParam(i, obj[i])
        }
      }
      return url
    },
    setUrlParam: function(key, value) {
      var url = this
      var r = url
      if (r != null && r !== 'undefined' && r !== '') {
        value = encodeURIComponent(value)
        var reg = new RegExp('(^|)' + key + '=([^&]*)(|$)')
        var tmp = key + '=' + value
        if (url.match(reg) != null) {
          r = url.replace(reg, tmp)
        } else {
          if (url.match('[\?]')) {
            r = url + '&' + tmp
          } else {
            r = url + '?' + tmp
          }
        }
      }
      return r
    },
    /**
     * 获取url参数
     * @param name 参数名称，为空则返回所有参数Object集合
     * @returns {*}
     */
    getUrlParams: function(name) {
      var $location
      var $params = {}
      const url = this
      if (url) {
        $location = document.createElement('a')
        $location.href = url
      } else {
        $location = window.location
      }
      var $seg = $location.search.replace(/^\?/, '').split('&')
      var len = $seg.length
      var $p
      for (var i = 0; i < len; i++) {
        if ($seg[i]) {
          $p = $seg[i].split('=')
          $params[$p[0]] = decodeURIComponent($p[1])
        }
      }
      return (name ? $params[name] : $params)
    }
  })

  /* Function */
  $.extend(Function.prototype, {
    // to fixed String.prototype -> toFunc
    toFunc: function() {
      return this
    }
  })

  /* Array */
  $.extend(Array.prototype, {
    remove: function(index) {
      if (index < 0) {
        return this
      } else {
        return this.slice(0, index).concat(this.slice(index + 1, this.length))
      }
    },
    unique: function() {
      var temp = []

      this.sort()
      for (var i = 0; i < this.length; i++) {
        if (this[i] === this[i + 1]) continue
        temp[temp.length] = this[i]
      }

      return temp
    },
    myIndexOf: function(e) {
      return this.indexOf(e)
    },
    /* serializeArray to json */
    toJson: function() {
      var o = {}
      var a = this

      $.each(a, function() {
        if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]]
          }
          o[this.name].push(this.value || '')
        } else {
          o[this.name] = this.value || ''
        }
      })

      return o
    }
  })

  /* Global */
  $.isJson = function(obj) {
    var flag = true

    try {
      flag = $.parseJSON(obj)
    } catch (e) {
      return false
    }
    return !!flag
  }
}(jQuery))
