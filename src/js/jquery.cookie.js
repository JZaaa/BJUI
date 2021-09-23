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
      return XEUtils.cookie.remove(name, options)
    }
    return XEUtils.cookie.set(name, value, options)
  } else {
    // get cookie
    return XEUtils.cookie.get(name)
  }
}
