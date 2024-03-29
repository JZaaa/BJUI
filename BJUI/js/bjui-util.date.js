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

  /**
   * parseDate( date_string , format_string )
   *
   * This function takes a date string and a format string. It matches
   * If the date string matches the format string, it returns the date.
   * If it does not match, it returns 0.
   * @param {Object} val
   * @param {Object} format
   */
  function parseDate(val, format) {
    val = val + ''
    format = format + ''

    var i
    var i_val = 0
    var i_format = 0
    var c = ''
    var token = ''
    var x, y
    var now = new Date(1900, 0, 1)
    var year = now.getYear()
    var month = now.getMonth() + 1
    var date = 1
    var hh = now.getHours()
    var mm = now.getMinutes()
    var ss = now.getSeconds()
    var ampm = ''

    while (i_format < format.length) {
      // Get next token from format string
      c = format.charAt(i_format)
      token = ''
      while (format.charAt(i_format) === c && i_format < format.length) {
        token += format.charAt(i_format++)
      }
      // Extract contents of value based on format token
      if (token === 'yyyy' || token === 'yy' || token === 'y') {
        if (token === 'yyyy') {
          x = 4
          y = 4
        }
        if (token === 'yy') {
          x = 2
          y = 2
        }
        if (token === 'y') {
          x = 2
          y = 4
        }
        year = _getInt(val, i_val, x, y)
        if (year === null) {
          return 0
        }
        i_val += year.length
        if (year.length === 2) {
          if (year > 70) {
            year = 1900 + (year - 0)
          } else {
            year = 2e3 + (year - 0)
          }
        }
      } else if (token === 'MMM' || token === 'NNN') {
        month = 0
        for (i = 0; i < MONTH_NAMES.length; i++) {
          var month_name = MONTH_NAMES[i]

          if (val.substring(i_val, i_val + month_name.length).toLowerCase() === month_name.toLowerCase()) {
            if (token === 'MMM' || token === 'NNN' && i > 11) {
              month = i + 1
              if (month > 12) {
                month -= 12
              }
              i_val += month_name.length
              break
            }
          }
        }
        if (month < 1 || month > 12) {
          return 0
        }
      } else if (token === 'EE' || token === 'E') {
        for (i = 0; i < DAY_NAMES.length; i++) {
          var day_name = DAY_NAMES[i]

          if (val.substring(i_val, i_val + day_name.length).toLowerCase() === day_name.toLowerCase()) {
            i_val += day_name.length
            break
          }
        }
      } else if (token === 'MM' || token === 'M') {
        month = _getInt(val, i_val, token.length, 2)
        if (month === null || month < 1 || month > 12) {
          return 0
        }
        i_val += month.length
      } else if (token === 'dd' || token === 'd') {
        date = _getInt(val, i_val, token.length, 2)
        if (date === null || date < 1 || date > 31) {
          return 0
        }
        i_val += date.length
      } else if (token === 'hh' || token === 'h') {
        hh = _getInt(val, i_val, token.length, 2)
        if (hh === null || hh < 1 || hh > 12) {
          return 0
        }
        i_val += hh.length
      } else if (token === 'HH' || token === 'H') {
        hh = _getInt(val, i_val, token.length, 2)
        if (hh === null || hh < 0 || hh > 23) {
          return 0
        }
        i_val += hh.length
      } else if (token === 'KK' || token === 'K') {
        hh = _getInt(val, i_val, token.length, 2)
        if (hh === null || hh < 0 || hh > 11) {
          return 0
        }
        i_val += hh.length
      } else if (token === 'kk' || token === 'k') {
        hh = _getInt(val, i_val, token.length, 2)
        if (hh === null || hh < 1 || hh > 24) {
          return 0
        }
        i_val += hh.length
        hh--
      } else if (token === 'mm' || token === 'm') {
        mm = _getInt(val, i_val, token.length, 2)
        if (mm === null || mm < 0 || mm > 59) {
          return 0
        }
        i_val += mm.length
      } else if (token === 'ss' || token === 's') {
        ss = _getInt(val, i_val, token.length, 2)
        if (ss === null || ss < 0 || ss > 59) {
          return 0
        }
        i_val += ss.length
      } else if (token === 'a') {
        if (val.substring(i_val, i_val + 2).toLowerCase() === 'am') {
          ampm = 'AM'
        } else if (val.substring(i_val, i_val + 2).toLowerCase() === 'pm') {
          ampm = 'PM'
        } else {
          return 0
        }
        i_val += 2
      } else {
        if (val.substring(i_val, i_val + token.length) !== token) {
          return 0
        } else {
          i_val += token.length
        }
      }
    }
    // If there are any trailing characters left in the value, it doesn't match
    if (i_val !== val.length) {
      return 0
    }
    // Is date valid for month?
    if (month === 2) {
      // Check for leap year
      if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
        // leap year
        if (date > 29) {
          return 0
        }
      } else {
        if (date > 28) {
          return 0
        }
      }
    }
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      if (date > 30) {
        return 0
      }
    }
    // Correct hours value
    if (hh < 12 && ampm === 'PM') {
      hh = hh + 12
    } else if (hh > 11 && ampm === 'AM') {
      hh -= 12
    }

    return new Date(year, month - 1, date, hh, mm, ss)
  }

  Date.prototype.formatDate = function(dateFmt) {
    return formatDate(this, dateFmt)
  }

  String.prototype.parseDate = function(dateFmt) {
    if (this.length < dateFmt.length) {
      dateFmt = dateFmt.slice(0, this.length)
    }
    return parseDate(this, dateFmt)
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
