import $ from 'jquery'
import BaseComponents from '@/components/baseComponents'

const NAME = 'toast'

const Selector = {
  toastWrapId: 'bjui-toast-wrap',
  toastCommonClass: 'bjui-toast-wrap__content',
  topLeft: 'top-left',
  topCenter: 'top-center',
  topRight: 'top-right',
  bottomLeft: 'bottom-left',
  bottomCenter: 'bottom-center',
  bottomRight: 'bottom-right'
}

const Default = {
  position: 'top-center', // 加载文本
  autohide: true, // 自动关闭
  delay: 2000, // 自动关闭时间
  type: 'normal', // 类型，normal | info | success | warning | error
  closeBtn: false,
  title: null,
  subTitle: null,
  content: null
}

class Toast extends BaseComponents {
  constructor(options) {
    super(null)
    this._options = this._setOptions(options)
    this._$toastWrap = this._initWrap()
    this._create()
  }

  hide() {
    this.dispose()
  }

  dispose() {
    this._BsToast.dispose()
    this._$toast.remove()
  }

  _setOptions(options) {
    return {
      ...Default,
      ...options
    }
  }

  _initWrap() {
    let $toastWrap = $('#' + Selector.toastWrapId)
    if (!$toastWrap.length) {
      $toastWrap = $(`
              <div id="${Selector.toastWrapId}" class="bjui-toast-wrap">
                <div class="${Selector.topLeft} ${Selector.toastCommonClass}"></div>
                <div class="${Selector.topCenter} ${Selector.toastCommonClass}"></div>
                <div class="${Selector.topRight} ${Selector.toastCommonClass}"></div>
                <div class="${Selector.bottomLeft} ${Selector.toastCommonClass}"></div>
                <div class="${Selector.bottomCenter} ${Selector.toastCommonClass}"></div>
                <div class="${Selector.bottomRight} ${Selector.toastCommonClass}"></div>
              </div>
      `)
      $toastWrap.appendTo($('body'))
    }
    return $toastWrap
  }

  _create() {
    const $box = this._$toastWrap.find('.' + this._options.position)
    const options = this._options
    if ($box.length) {
      const showHeader = options.title || options.subTitle || options.closeBtn
      let header = ''
      let showBody = options.content ? `<div class="toast-body">${options.content}</div>` : ''
      let headerClass = showBody.length ? 'with-body' : 'without-body'

      if (showHeader) {
        let title = options.title
        if (options.content && !options.title && !options.subTitle) {
          title = options.content
          showBody = ''
          headerClass = 'without-body'
        }

        const closeBtn = `<button type="button" class="close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>`

        header = `
        <div class="toast-header ${headerClass}">
          <div class="toast-header__title mr-auto">${title || ''}</div>
          <small class="toast-header__title-sub">${options.subTitle || ''}</small>
          ${options.closeBtn ? closeBtn : ''}
        </div>
        `
      }

      const $toast = $(`
         <div class="toast ${options.type}" role="alert" aria-live="assertive" aria-atomic="true">
          ${header}
          ${showBody}
        </div>
      `)
      this._$toast = $toast
      $toast.appendTo($box)
      this._BsToast = $toast.toast(options).data('bs.toast')
      $toast.on('hidden.bs.toast', () => {
        this.dispose()
      })
      this._BsToast.show()
    }
  }

  static get NAME() {
    return NAME
  }

  static jQueryInterface(config) {
    return new Toast(config)
  }
}

export default Toast
