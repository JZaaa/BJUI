import { menuContentSelector } from '@/utils/static'

/**
 * 监听router变化
 * @private
 */
window.addEventListener('hashchange', () => {
  $(menuContentSelector).sidebar('changeActiveMenu', location.hash)
})
