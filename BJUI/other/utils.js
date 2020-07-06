(function($) {
  'use strict'
  if (!$.isFunction($.fn.findFilter)) {
    /**
     * 查找 [data-filter] 属性的dom元素
     *
     * 当前弹窗中查找[data-filter="a"]的元素
     * $.CurrentDialog.findFilter('a')
     */
    $.fn.findFilter = function(filter) {
      if (filter) {
        return this.find('[data-filter="' + filter + '"]')
      }
      return undefined
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
}(jQuery))
