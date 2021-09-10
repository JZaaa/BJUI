import Cookies from 'js-cookie'

/**
 * Cookie plugin
 * jQuery Cookie封装
 *
 */

jQuery.cookie = function(name, value, options) {
  if (typeof value !== 'undefined') {
    // set cookie
    options = options || {}
    if (value === null) {
      // remove cookie
      return Cookies.remove(name, options)
    }
    return Cookies.set(name, value, options)
  } else {
    // get cookie
    return Cookies.get(name)
  }
}
