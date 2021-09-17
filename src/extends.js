import { getGUID } from '@/utils'

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

  if (!$.getGUID) {
    /**
     * 获取一串随机数
     * @returns {string}
     */
    $.getGUID = getGUID
  }
}(jQuery))
