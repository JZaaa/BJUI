(function($) {
  'use strict'
  if (!$.isFunction($.fn.findFilter)) {
    /**
     * @param filter
     * @param selector
     * 查找 [data-filter] 属性的dom元素
     *
     * 当前弹窗中查找[data-filter="a"]的元素
     * $.CurrentDialog.findFilter('a')
     * 查找div[data-filter="a"]的元素
     * $.CurrentDialog.findFilter('a', 'div')
     */
    $.fn.findFilter = function(filter, selector) {
      if (filter) {
        return this.find((selector || '') + '[data-filter="' + filter + '"]')
      }
      return undefined
    }
  }

  if (! $.fn.loading) {
    /**
     * 加载条
     * $.CurrentDialog.loading() | $.CurrentNavtab.loading()
     * @param type
     */
    $.fn.loading = function (type) {
      if (type !== false) {
        $(this).trigger(BJUI.eventType.ajaxStatus)
      } else {
        $(this).trigger('bjui.ajaxStop')
      }
    }
  }

  if (!$.getRandom) {
    /**
     * 获取一串随机数
     * @returns {string}
     */
    $.getRandom = function() {
      var d = Date.now()
      if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now()
      }
      return 'b' + ('xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      }))
    }
  }

  if (!$.ajaxRequest) {
    /**
     * ajax请求封装
     * @param op 选项
     * method {string} 请求类型
     * url {string} 请求地址
     * success {callable} 成功回调
     * error {callable} 失败回调
     * loading {boolean|$box} 是否存在加载框 默认false，需要指定 $.CurrentDialog 获取 $.CurrentNavtab
     * loadingFunc {callable}
     */
    $.ajaxRequest = function (op) {
      var contentType = op.contentType || 'application/json'
      var data = op.data || {}
      var method = op.method || 'GET'
      $.ajax({
        method: method,
        url: op.url,
        data: (contentType === 'application/json' && method.toUpperCase() === 'POST') ? JSON.stringify(data) : $.extend({}, data),
        cache: false,
        contentType: contentType,
        dataType: op.dataType || 'json',
        timeout: BJUI.ajaxTimeout,
        success: function (json) {
          if (!json[BJUI.keys.statusCode]) {
            op.error && op.error(json)
          } else {
            if (json[BJUI.keys.statusCode] === BJUI.statusCode.error || json[BJUI.keys.statusCode] === BJUI.statusCode.forbidden) {
              if (json[BJUI.keys.message]) $('body').alertmsg('error', json[BJUI.keys.message])
              op.error && op.error(json)
            } else if (json[BJUI.keys.statusCode] === BJUI.statusCode.timeout || json[BJUI.keys.statusCode] === BJUI.statusCode.unauthorized) {
              $('body').alertmsg('info', (json[BJUI.keys.message] || BJUI.regional.sessiontimeout))
              BJUI.loadLogin()
            } else if (json[BJUI.keys.statusCode] === BJUI.statusCode.ok) {
              op.success && op.success(json)
            } else {
              op.error && op.error(json)
            }
          }
        },
        beforeSend: function () {
          if (op.loadingFunc) {
            op.loadingFunc(true)
          } else if (op.loading) {
            op.loading.loading()
          }
        },
        complete: function () {
          if (op.loadingFunc) {
            op.loadingFunc(false)
          } else if (op.loading) {
            op.loading.loading(false)
          }
          if (op.complete) {
            op.complete()
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          op.error && op.error({
            statusCode: xhr.status,
            message: '请求失败'
          })
        },
        statusCode: BJUI.ajaxStatusCodeObj
      })
    }
  }
}(jQuery))
