/*!
 * B-JUI  v1.2 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-extends.js  v1.2
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.core.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-extends.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+(function($) {
  'use strict'

  $.fn.extend({
    /**
     *  @param {object} op {type:GET/POST, url:ajax请求地址, data:ajax请求参数列表, callback:回调函数 }
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
          var $ajaxMask = $this.find('> .bjui-ajax-mask')
          if (!json[BJUI.keys.statusCode]) {
            $this.empty().html(response).append($ajaxMask).initui()
            if ($.isFunction(op.callback)) op.callback(response)
          } else {
            if (json[BJUI.keys.statusCode] === BJUI.statusCode.error || json[BJUI.keys.statusCode] === BJUI.statusCode.forbidden) {
              if (json[BJUI.keys.message]) $this.alertmsg('error', json[BJUI.keys.message])
              if (!$this.closest('.bjui-layout').length) {
                if ($this.closest('.navtab-panel').length) $this.navtab('closeCurrentTab')
                else $this.dialog('closeCurrent')
              }
            } else if (json[BJUI.keys.statusCode] === BJUI.statusCode.timeout || json[BJUI.keys.statusCode] === BJUI.statusCode.unauthorized) {
              if ($this.closest('.bjui-dialog').length) $this.dialog('closeCurrent')
              if ($this.closest('.navtab-panel').length) $this.navtab('closeCurrentTab')

              $('body').alertmsg('info', (json[BJUI.keys.message] || BJUI.regional.sessiontimeout))
              BJUI.loadLogin()
            }
            $ajaxMask.fadeOut('normal', function() {
              $(this).remove()
            })
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          $this.bjuiajax('ajaxError', xhr, ajaxOptions, thrownError)
          if (!$this.closest('.bjui-layout').length) {
            if ($this.closest('.navtab-panel').length) $this.navtab('closeCurrentTab')
            else $this.dialog('closeCurrent')
          }
          $this.trigger('bjui.ajaxError')
        },
        statusCode: BJUI.ajaxStatusCodeObj
      })
    },
    loadUrl: function(url, data, callback) {
      $(this).ajaxUrl({ url: url, data: data, callback: callback })
    },
    doAjax: function(op) {
      var $this = $(this); var $target; var $ajaxMask

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
        if ($target && $target.length) {
          $target.trigger(BJUI.eventType.ajaxStatus)
          $ajaxMask = $target.find('> .bjui-ajax-mask')
        }
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
        if ($ajaxMask) {
          $target.trigger('bjui.ajaxError')
        }
      }

      $.ajax(op)
    },
    getPageTarget: function() {
      var $target

      if (this.closest('.bjui-layout').length) $target = this.closest('.bjui-layout')
      else if (this.closest('.navtab-panel').length) $target = $.CurrentNavtab
      else $target = $.CurrentDialog

      return $target
    },
    /**
     * 获取指定navtab或dialog的查询数据与分页数据
     * @param delCount 删除数据量
     * @return {{pageInfo: {pageSize, pageCurrent: *}, searchData: (*|{})}}
     */
    getPageSearchData: function (delCount) {
      var $panel = this
      var pageInfo = $panel.find('[data-toggle="pagination"]').data()
      var searchData = $panel.find('form[data-toggle="ajaxsearch"]').data('ajaxSearchData') || {}
      if (pageInfo && delCount && (+delCount) > 0) {
        var pageCurrent = Math.ceil((pageInfo.total - (+delCount)) / (+pageInfo.pageSize))
        if (pageCurrent <= 0) {
          pageCurrent = 1
        }
        if (pageCurrent < (+pageInfo.pageCurrent)) {
          pageInfo.pageCurrent = pageCurrent
        }
      }
      if (!pageInfo) {
        pageInfo = {}
      }
      return {
        searchData: searchData,
        pageInfo: {
          pageSize: pageInfo.pageSize,
          pageCurrent: pageInfo.pageCurrent,
          total: (+pageInfo.total)
        }
      }
    },
    resizePageH: function() {
      return this.each(function() {
        if ($(this).closest('.tab-content').length) return

        var $box = $(this)
        if ($box.is(':hidden')) {
          return
        }

        var $pageWrap = $box.find('> .bjui-pageWrap')

        if (!($pageWrap && $pageWrap.length)) {
          $pageWrap = $box
        }

        var $pageHeader = $pageWrap.find('> .bjui-pageHeader')

        var $pageContent = $pageWrap.find('> .bjui-pageContent')

        var $pageFooter = $pageWrap.find('> .bjui-pageFooter')

        var headH = $pageHeader.outerHeight() || 0

        var footH = $pageFooter.outerHeight() || 0

        if ($box.hasClass('navtabPage') && $box.is(':hidden')) {
          $box.show()
          headH = $pageHeader.outerHeight() || 0
          footH = $pageFooter.outerHeight() || 0
          $box.hide()
        }
        if ($pageFooter.css('bottom')) footH += parseInt($pageFooter.css('bottom')) || 0
        if (footH === 0 && $box.hasClass('dialogContent')) footH = 5
        $pageContent.css({ top: headH, bottom: footH })
      })
    },
    getMaxIndexObj: function($elements) {
      var zIndex = 0; var index = 0

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
    isInteger: function() {
      return (new RegExp(/^\d+$/).test(this))
    },
    isNumber: function() {
      return (new RegExp(/^([-]{0,1}(\d+)[\.]+(\d+))|([-]{0,1}(\d+))$/).test(this))
    },
    includeChinese: function() {
      return (new RegExp(/[\u4E00-\u9FA5]/).test(this))
    },
    trim: function() {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
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
    trans: function() {
      return this.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    },
    encodeTXT: function() {
      return (this).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll(' ', '&nbsp;')
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
    replaceTm: function($data) {
      if (!$data) return this

      return this.replace(RegExp('({[A-Za-z_]+[A-Za-z0-9_-]*})', 'g'), function($1) {
        return $data[$1.replace(/[{}]+/g, '')]
      })
    },
    replaceTmById: function(_box) {
      var $parent = _box || $(document)

      return this.replace(RegExp('({[A-Za-z_]+[A-Za-z0-9_-]*})', 'g'), function($1) {
        var $input = $parent.find('#' + $1.replace(/[{}]+/g, ''))
        return $input.val() ? $input.val() : $1
      })
    },
    isFinishedTm: function() {
      return !(new RegExp('{\/?[^}]*}').test(this))
    },
    skipChar: function(ch) {
      if (!this || this.length === 0) return ''
      if (this.charAt(0) === ch) return this.substring(1).skipChar(ch)
      return this
    },
    isValidPwd: function() {
      return (new RegExp(/^([_]|[a-zA-Z0-9]){6,32}$/).test(this))
    },
    isValidMail: function() {
      return (new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(this.trim()))
    },
    isSpaces: function() {
      for (var i = 0; i < this.length; i += 1) {
        var ch = this.charAt(i)

        if (ch !== ' ' && ch !== '\n' && ch !== '\t' && ch !== '\r') return false
      }
      return true
    },
    isPhone: function() {
      return (new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/).test(this))
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
        if (!json.trim().match('^\{(.+:.+,*){1,}\}$')) return this
        else return JSON.parse(this)
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
     * @param url 目标url，默认为当前url
     * @returns {*}
     */
    getQuery: function(name, url) {
      var $location
      var $params = {}
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
      if (index < 0) return this
      else return this.slice(0, index).concat(this.slice(index + 1, this.length))
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

  /**
   * 获取一串随机数
   * @param {Number} len uuid的长度
   * @param {Boolean} firstU 将返回的首字母置为"u"
   * @param {number} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
   * @returns {string}
   */
  $.getGUID = function(len, firstU, radix) {
    len = len || 32
    firstU = firstU || true
    radix = radix || null
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    var uuid = []
    radix = radix || chars.length

    if (len) {
      // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
      for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
      var r
      // rfc4122标准要求返回的uuid中,某些位为固定的字符
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'

      for (var i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
    if (firstU) {
      uuid.shift()
      return 'u' + uuid.join('')
    } else {
      return uuid.join('')
    }
  }
}(jQuery))
