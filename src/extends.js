import { getGUID } from '@/utils'

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
        return this.find(`${selector || ''}[data-filter="${filter}"]`)
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
