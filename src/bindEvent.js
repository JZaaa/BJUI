import { menuContentSelector } from '@/utils/static'

/**
 * 监听router变化
 * @private
 */
window.addEventListener('hashchange', () => {
  // 仅允许切换菜单页面
  if ($.CurrentNavtab) {
    const options = $.CurrentNavtab.data('options') || {}
    const hash = options.hash
    const currentHash = location.hash
    if (hash && location.hash && hash !== currentHash) {
      const $a = $(menuContentSelector).find(`a[data-hash="${currentHash}"]`)
      if ($a.length) {
        $(menuContentSelector).sidebar('changeActiveMenu', null, $a)
      }
    }
  }
  // $(menuContentSelector).sidebar('changeActiveMenu', location.hash)
})
