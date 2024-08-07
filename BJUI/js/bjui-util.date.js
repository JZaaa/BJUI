/*!
 * B-JUI  v1.2 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-util.date.js  v1.2
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.util.date.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-util.date.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+(function($) {
  'use strict'

  var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  /**
   * @return {string}
   */
  function LZ(x) {
    return (x < 0 || x > 9 ? '' : '0') + x
  }

  /**
   * formatDate (date_object, format)
   * Returns a date in the output format specified.
   * The format string uses the same abbreviations as in parseDate()
   * @param {Object} date
   * @param {Object} format
   */
  function formatDate(date, format) {
    format = format + ''
    var result = ''
    var i_format = 0
    var c = ''
    var token = ''
    var y = date.getYear() + ''
    var M = date.getMonth() + 1
    var d = date.getDate()
    var E = date.getDay()
    var H = date.getHours()
    var m = date.getMinutes()
    var s = date.getSeconds()
    // Convert real date parts into formatted versions
    var value = {}

    if (y.length < 4) {
      y = '' + (y - 0 + 1900)
    }
    value['y'] = '' + y
    value['yyyy'] = y
    value['yy'] = y.substring(2, 4)
    value['M'] = M
    value['MM'] = LZ(M)
    value['MMM'] = MONTH_NAMES[M - 1]
    value['NNN'] = MONTH_NAMES[M + 11]
    value['d'] = d
    value['dd'] = LZ(d)
    value['E'] = DAY_NAMES[E + 7]
    value['EE'] = DAY_NAMES[E]
    value['H'] = H
    value['HH'] = LZ(H)

    if (H === 0) {
      value['h'] = 12
    } else if (H > 12) {
      value['h'] = H - 12
    } else {
      value['h'] = H
    }
    value['hh'] = LZ(value['h'])

    if (H > 11) {
      value['K'] = H - 12
    } else {
      value['K'] = H
    }
    value['k'] = H + 1
    value['KK'] = LZ(value['K'])
    value['kk'] = LZ(value['k'])

    if (H > 11) {
      value['a'] = 'PM'
    } else {
      value['a'] = 'AM'
    }
    value['m'] = m
    value['mm'] = LZ(m)
    value['s'] = s
    value['ss'] = LZ(s)

    while (i_format < format.length) {
      c = format.charAt(i_format)
      token = ''

      while (format.charAt(i_format) === c && i_format < format.length) {
        token += format.charAt(i_format++)
      }
      if (value[token] != null) {
        result += value[token]
      } else {
        result += token
      }
    }
    return result
  }

  function _isInteger(val) {
    return new RegExp(/^\d+$/).test(val)
  }

  function _getInt(str, i, minlength, maxlength) {
    for (var x = maxlength; x >= minlength; x--) {
      var token = str.substring(i, i + x)

      if (token.length < minlength) {
        return null
      }
      if (_isInteger(token)) {
        return token
      }
    }
    return null
  }

  Date.prototype.formatDate = function(dateFmt) {
    return formatDate(this, dateFmt)
  }

  /**
   * dateFmt:%y-%M-%d
   * %y-%M-%d
   * ex: new Date().formatDateTm('%y-%M-%d')
   *     new Date().formatDateTm('2012-1')
   */
  Date.prototype.formatDateTm = function(dateFmt) {
    var y = this.getFullYear()
    var m = this.getMonth() + 1
    var d = this.getDate()
    var sDate = dateFmt.replaceAll('%y', y).replaceAll('%M', m).replaceAll('%d', d)

    var _y = 1900; var _m = 0; var _d = 1
    var aDate = sDate.split('-')

    if (aDate.length > 0) _y = aDate[0]
    if (aDate.length > 1) _m = aDate[1] - 1
    if (aDate.length > 2) _d = aDate[2]

    return new Date(_y, _m, _d).formatDate('yyyy-MM-dd')
  }

  /**
   * 时间格式化
   * 示例： Date.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
   * @param time Date对象 或 时间戳， 默认当前时间
   * @param format 返回格式 默认：{y}-{m}-{d} {h}:{i}:{s}
   * @returns {void | string}
   */
  Date.parseTime = function(time, format) {
    time = time || new Date()
    format = format || '{y}-{m}-{d} {h}:{i}:{s}'
    var date
    if (typeof time === 'object') {
      date = time
    } else {
      if (('' + time).length === 10) time = parseInt(time) * 1000
      date = new Date(time)
    }
    var formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    return format.replace(/{([ymdhis])+}/g, function(result, key) {
      var value = formatObj[key]
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
  }
  /**
   * 设置0点
   * @returns {Date}
   */
  Date.prototype.startTime = function() {
    this.setHours(0)
    this.setMinutes(0)
    this.setSeconds(0)
    this.setMilliseconds(0)
    return this
  }
  /**
   * @returns {Date}
   */
  Date.prototype.endTime = function() {
    this.setHours(23)
    this.setMinutes(59)
    this.setSeconds(59)
    this.setMilliseconds(999)
    return this
  }

  /**
   * 返回当天时间- 00:00:00|23:59:59
   * @param type {String} start|end
   * @returns {Date}
   */
  Date.today = function(type) {
    type = type || 'start'
    if (type === 'start') {
      return new Date().startTime()
    } else {
      return new Date().endTime()
    }
  }
}(jQuery))
