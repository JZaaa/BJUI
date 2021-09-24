import { menuContentSelector, appSelector } from '@/utils/static'

(function() {
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

  let menuCollapsed = false

  const resizeEvent = () => {
    const width = $(document).width()
    if (width < 900) {
      if (!menuCollapsed && !$(appSelector).hasClass('menu-collapsed')) {
        menuCollapsed = true
        console.log(1)
        $(menuContentSelector).sidebar('toggleCollapse')
      }
    } else {
      if (menuCollapsed && $(appSelector).hasClass('menu-collapsed')) {
        menuCollapsed = false
        console.log(2)
        $(menuContentSelector).sidebar('toggleCollapse')
      }
    }
  }
  /**
   * 监听窗口变化
   */
  window.addEventListener('resize', XEUtils.debounce(resizeEvent, 100))
}())

