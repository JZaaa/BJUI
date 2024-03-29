/*!
 * B-JUI  v1.2 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-frag.js  v1.2
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.frag.xml (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-frag.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+(function($) {
  'use strict'

  BJUI.setRegional('alertmsg', {
    title: { error: 'Error', info: 'Info', warn: 'Warning', correct: 'Correct', confirm: 'Confirm' },
    btnMsg: { ok: 'OK', yes: 'YES', no: 'NO', cancel: 'Cancel' }
  })

  BJUI.setRegional('dialog', {
    close: 'Close',
    maximize: 'Maximize',
    restore: 'Restore',
    minimize: 'Minimize',
    title: 'Popup window'
  })

  BJUI.setRegional('orderby', {
    asc: 'Asc',
    desc: 'Desc'
  })

  BJUI.setRegional('pagination', {
    first: 'First page',
    last: 'Last page',
    prev: 'Prev page',
    next: 'Next page',
    jumpto: 'Jump page number',
    jump: 'Jump'
  })

  BJUI.setRegional('progressmsg', 'Data loading, please waiting...')

  BJUI.setRegional('datepicker', {
    close: 'Close',
    prev: 'Prev month',
    next: 'Next month',
    clear: 'Clear',
    ok: 'OK',
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  })

  BJUI.setRegional('navtabCM', {
    refresh: 'Refresh navtab',
    close: 'Close navtab',
    closeother: 'Close other navtab',
    closeall: 'Close all navtab'
  })

  BJUI.setRegional('dialogCM', {
    refresh: 'Refresh dialog',
    close: 'Close dialog',
    closeother: 'Close other dialog',
    closeall: 'Close all dialog'
  })

  BJUI.setRegional('upload', {
    upConfirm: 'Start upload',
    upPause: 'Pause upload',
    upCancel: 'Cancel upload'
  })

  BJUI.setRegional('statusCode_503', 'The current server load is too large or is down for maintenance!')

  BJUI.setRegional('sessiontimeout', 'Session timeout, please login!')

  BJUI.setRegional('plhmsg', 'Placeholder corresponding selector None Valid!')

  BJUI.setRegional('nocheckgroup', 'Undefined group name selected item [check box "data-group"]!')

  BJUI.setRegional('notchecked', 'Unchecked any one!')

  BJUI.setRegional('selectmsg', 'Please select one option!')

  BJUI.setRegional('validatemsg', 'Submitted form data has [{0}] field an error, please after modified submitting!')

  BJUI.setRegional('uititle', 'B-JUI')

  BJUI.setRegional('maintab', 'My home')

  window.FRAG = {
    dialog: '<div class="bjui-dialog bjui-dialog-container" style="top:150px; left:300px;">' +
                '    <div class="dialogHeader" onselectstart="return false;" oncopy="return false;" onpaste="return false;" oncut="return false;">' +
                '        <a class="close" href="#close" title="#close#"><i class="bjicon-cancel-circled"></i></a>' +
                '        <a class="maximize" href="#maximize" title="#maximize#"><i class="bjicon-plus-circled"></i></a>' +
                '        <a class="restore" href="#restore" title="#restore#"><i class="bjicon-history"></i></a>' +
                '        <a class="minimize" href="#minimize" title="#minimize#"><i class="bjicon-minus-circled"></i></a>' +
                '        <h1><span><i class="bjicon-th-large"></i></span> <span class="title">#title#</span></h1>' +
                '    </div>' +
                '    <div class="dialogContent unitBox"></div>' +
                '    <div class="resizable_h_l" tar="nw"></div>' +
                '    <div class="resizable_h_r" tar="ne"></div>' +
                '    <div class="resizable_h_c" tar="n"></div>' +
                '    <div class="resizable_c_l" tar="w" style="height:100%;"></div>' +
                '    <div class="resizable_c_r" tar="e" style="height:100%;"></div>' +
                '    <div class="resizable_f_l" tar="sw"></div>' +
                '    <div class="resizable_f_r" tar="se"></div>' +
                '    <div class="resizable_f_c" tar="s"></div>' +
                '</div>',
    taskbar: '<div id="bjui-taskbar" style="left:0px; display:none;">' +
                 '    <div class="taskbarContent">' +
                 '        <ul></ul>' +
                 '    </div>' +
                 '    <div class="taskbarLeft taskbarLeftDisabled"><i class="bjicon-angle-double-left"></i></div>' +
                 '    <div class="taskbarRight"><i class="bjicon-angle-double-right"></i></div>' +
                 '</div>',
    splitBar: '<div id="bjui-splitBar"></div>',
    splitBarProxy: '<div id="bjui-splitBarProxy"></div>',
    resizable: '<div id="bjui-resizable" class="bjui-resizable"></div>',
    alertBackground: '<div class="bjui-alertBackground"></div>',
    maskBackground: '<div class="bjui-maskBackground bjui-ajax-mask"></div>',
    maskProgress: '<div class="bjui-maskProgress bjui-ajax-mask"><i class="bjicon-cog bjicon-spin"></i>&nbsp;&nbsp;#msg#<div class="progressBg"><div class="progress"></div></div></div>',
    progressBar_custom: '<div id="bjui-progressBar-custom" class="progressBar"><i class="bjicon-cog bjicon-spin"></i> <span></span></div>',
    dialogMask: '<div class="bjui-dialogBackground"></div>',
    orderby: '<a href="javascript:;" class="order asc" data-order-direction="asc" title="#asc#"><i class="bjicon-angle-up"></i></a>' +
                 '<a href="javascript:;" class="order desc" data-order-direction="desc" title="#desc#"><i class="bjicon-angle-down"></i></a>',
    slidePanel: '<div class="panel panel-default">' +
                    '    <div class="panel-heading">' +
                    '        <h4 class="panel-title"><a data-toggle="collapse" data-parent="#bjui-accordionmenu" href="##id#" class="#class#">#icon#&nbsp;#title#<b>#righticon#</b></a></h4>' +
                    '    </div>' +
                    '    <div id="#id#" class="panel-collapse collapse#bodyclass#">' +
                    '        <div class="panel-body">' +
                    '        </div>' +
                    '    </div>' +
                    '</div>',
    pagination: '<ul class="pagination">' +
                    '    <li class="j-first">' +
                    '        <a class="first" href="javascript:;"><i class="bjicon-to-start"></i> #first#</a>' +
                    '        <span class="first"><i class="bjicon-to-start"></i> #first#</span>' +
                    '    </li>' +
                    '    <li class="j-prev">' +
                    '        <a class="previous" href="javascript:;"><i class="bjicon-fast-bw"></i> #prev#</a>' +
                    '        <span class="previous"><i class="bjicon-fast-bw"></i> #prev#</span>' +
                    '    </li>' +
                    '    #pageNumFrag#' +
                    '    <li class="j-next">' +
                    '        <a class="next" href="javascript:;">#next# <i class="bjicon-fast-fw"></i></a>' +
                    '        <span class="next">#next# <i class="bjicon-fast-fw"></i></span>' +
                    '    </li>' +
                    '    <li class="j-last">' +
                    '        <a class="last" href="javascript:;">#last# <i class="bjicon-to-end"></i></a>' +
                    '        <span class="last">#last# <i class="bjicon-to-end"></i></span>' +
                    '    </li>' +
                    '    <li class="jumpto"><span class="p-input"><input class="form-control input-sm-pages" type="text" size="2.6" value="#pageCurrent#" title="#jumpto#"></span><a class="goto" href="javascript:;" title="#jump#"><i class="bjicon-right-open"></i></a></li>' +
                    '</ul>',
    alertBoxFrag: '<div id="bjui-alertMsgBox" class="bjui-alert"><div class="alertContent"><div class="#type#"><div class="alertInner"><h1><i class="fa #fa#"></i>#title#</h1><div class="msg">#message#</div></div><div class="toolBar"><ul>#btnFragment#</ul></div></div></div></div>',
    alertBtnFrag: '<li><button class="btn btn-#class#" rel="#callback#" type="button">#btnMsg#</button></li>',
    calendarFrag: '<div id="bjui-calendar">' +
                      '    <div class="main">' +
                      '        <a class="close" href="javascript:;" title="#close#"><i class="bjicon-cancel-circled2"></i></a>' +
                      '        <div class="head">' +
                      '            <table width="100%" border="0" cellpadding="0" cellspacing="2">' +
                      '                <tr>' +
                      '                    <td width="20"><a class="prev" href="javascript:;" title="#prev#"><i class="bjicon-left-big"></i></a></td>' +
                      '                    <td><select name="year"></select></td>' +
                      '                    <td><select name="month"></select></td>' +
                      '                    <td width="20"><a class="next" href="javascript:;" title="#next#"><i class="bjicon-right-big"></i></a></td>' +
                      '                </tr>' +
                      '            </table>' +
                      '        </div>' +
                      '        <div class="body">' +
                      '            <dl class="dayNames"><dt>7</dt><dt>1</dt><dt>2</dt><dt>3</dt><dt>4</dt><dt>5</dt><dt>6</dt></dl>' +
                      '            <dl class="days"><!-- date list --></dl>' +
                      '            <div style="clear:both;height:0;line-height:0"></div>' +
                      '        </div>' +
                      '        <div class="foot">' +
                      '            <table class="time">' +
                      '                <tr>' +
                      '                    <td>' +
                      '                        <input type="text" class="hh" maxlength="2" data-type="hh" data-start="0" data-end="23">:<input' +
                      '                         type="text" class="mm" maxlength="2" data-type="mm" data-start="0" data-end="59">:<input' +
                      '                         type="text" class="ss" maxlength="2" data-type="ss" data-start="0" data-end="59">' +
                      '                    </td>' +
                      '                    <td><ul><li class="up" data-add="1">&and;</li><li class="down">&or;</li></ul></td>' +
                      '                </tr>' +
                      '            </table>' +
                      '            <button type="button" class="clearBtn btn btn-orange">#clear#</button>' +
                      '            <button type="button" class="okBtn btn btn-default">#ok#</button>' +
                      '        </div>' +
                      '        <div class="tm">' +
                      '            <ul class="hh">' +
                      '                <li>0</li>' +
                      '                <li>1</li>' +
                      '                <li>2</li>' +
                      '                <li>3</li>' +
                      '                <li>4</li>' +
                      '                <li>5</li>' +
                      '                <li>6</li>' +
                      '                <li>7</li>' +
                      '                <li>8</li>' +
                      '                <li>9</li>' +
                      '                <li>10</li>' +
                      '                <li>11</li>' +
                      '                <li>12</li>' +
                      '                <li>13</li>' +
                      '                <li>14</li>' +
                      '                <li>15</li>' +
                      '                <li>16</li>' +
                      '                <li>17</li>' +
                      '                <li>18</li>' +
                      '                <li>19</li>' +
                      '                <li>20</li>' +
                      '                <li>21</li>' +
                      '                <li>22</li>' +
                      '                <li>23</li>' +
                      '            </ul>' +
                      '            <ul class="mm">' +
                      '                <li>0</li>' +
                      '                <li>5</li>' +
                      '                <li>10</li>' +
                      '                <li>15</li>' +
                      '                <li>20</li>' +
                      '                <li>25</li>' +
                      '                <li>30</li>' +
                      '                <li>35</li>' +
                      '                <li>40</li>' +
                      '                <li>45</li>' +
                      '                <li>50</li>' +
                      '                <li>55</li>' +
                      '            </ul>' +
                      '            <ul class="ss">' +
                      '                <li>0</li>' +
                      '                <li>10</li>' +
                      '                <li>20</li>' +
                      '                <li>30</li>' +
                      '                <li>40</li>' +
                      '                <li>50</li>' +
                      '            </ul>' +
                      '        </div>' +
                      '    </div>' +
                      '</div>',
    spinnerBtn: '<ul class="bjui-spinner"><li class="up" data-add="1">&and;</li><li class="down">&or;</li></ul>',
    lookupBtn: '<a class="bjui-lookup" href="javascript:;" data-toggle="lookupbtn"><i class="bjicon-search"></i></a>',
    dateBtn: '<a class="bjui-lookup" href="javascript:;" data-toggle="datepickerbtn"><i class="bjicon-calendar"></i></a>',
    navtabCM: '<ul id="bjui-navtabCM">' +
                  '    <li rel="reload"><span class="icon"><i class="bjicon-arrows-cw"></i></span><span class="title">#refresh#</span></li>' +
                  '    <li rel="closeCurrent"><span class="icon"><i class="bjicon-cancel"></i></span><span class="title">#close#</li>' +
                  '    <li rel="closeOther"><span class="icon"><i class="bjicon-cancel"></i></span><span class="title">#closeother#</li>' +
                  '    <li rel="closeAll"><span class="icon"><i class="bjicon-cancel"></i></span><span class="title">#closeall#</li>' +
                  '</ul>',
    dialogCM: '<ul id="bjui-dialogCM">' +
                  '    <li rel="reload"><span class="icon"><i class="bjicon-arrows-cw"></i></span><span class="title">#refresh#</span></li>' +
                  '    <li rel="closeCurrent"><span class="icon"><i class="bjicon-cancel"></i></span><span class="title">#close#</span></li>' +
                  '    <li rel="closeOther"><span class="icon"><i class="bjicon-cancel"></i></span><span class="title">#closeother#</span></li>' +
                  '    <li rel="closeAll"><span class="icon"><i class="bjicon-cancel"></i></span><span class="title">#closeall#</span></li>' +
                  '</ul>',
    externalFrag: '<iframe src="{url}" style="width:100%;height:{height};" frameborder="no" border="0" marginwidth="0" marginheight="0"></iframe>',
    uploadTemp: '<div id="{fileId}" class="item">' +
                    '    <div class="info">' +
                    '        <span class="up_filename">{fileName}</span><span class="up_confirm" title="#upConfirm#"><i class="bjicon-play-circled2"></i></span><span class="up_pause" title="#upPause#"><span class="glyphicon glyphicon-pause"></span></span><span class="up_cancel" title="#upCancel#"><i class="bjicon-cancel-circled2-o"></i></span>' +
                    '    </div>' +
                    '    <div class="preview"><span class="img"></span></div>' +
                    '    <div class="progress"><div class="bar"></div></div>' +
                    '    <span class="percent">{percent}</span>' +
                    '    <span class="filesize"><span class="uploadedsize">{uploadedSize}</span>/<span class="totalsize">{fileSize}</span></span>' +
                    '</div>',
    uploadFrag: '<input class="bjui-upload-select-file" style="display:none;" type="file" name="fileselect[]" #multi# accept="#accept#">' +
                    '<a href="javascript:void(0)" class="#btn-default# bjui-upload-select">#btnTxt#</a>' +
                    '<div class="queue"></div>',
    statusCode_503: 'HTTP status 503, #statusCode_503#',
    sessionTimout: '#sessiontimeout#',
    alertPlhMsg: '#plhmsg#',
    alertNoCheckGroup: '#nocheckgroup#',
    alertNotChecked: '#notchecked#',
    alertSelectMsg: '#selectmsg#',
    validateErrorMsg: '#validatemsg#',
    uiTitle: '#uititle#',
    mainTabTitle: '#mynavtab#'
  }
}(jQuery))
