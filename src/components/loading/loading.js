/**
 * Loading组件
 */
import $ from 'jquery'
import BaseComponents from '@/components/baseComponents'

const NAME = 'loading'
const DATA_KEY = 'bj.loading'

const Default = {
  tip: '加载中...', // 加载文本
  absolute: false, // 是否绝对定位, false时全屏
  zIndex: null,
  background: null
}

class Loading extends BaseComponents {
  constructor(element, options) {
    super(element)
    this._options = this._setOptions(options)

    this._$dom = this._createNode()
  }

  open() {
    const node = this._getNode()
    if (!node) {
      this._$element.prepend(this._$dom)
    }
  }

  close() {
    const node = this._getNode()
    if (node) {
      node.remove()
    }
  }

  dispose() {
    this.close()
    this._$element.removeData(DATA_KEY)
  }

  _setOptions(options) {
    return {
      ...Default,
      ...options
    }
  }

  _getNode() {
    return this._element.querySelector('.bj-full-loading')
  }

  _createNode() {
    const section = document.createElement('section')
    section.className = 'bj-full-loading ' + (this._options.absolute ? 'absolute' : '')
    const spin =
      `<div class="spinner">
        <div class="spinner-border" role="status"></div>
        <div>${this._options.tip}</div>
    </div>`
    const $section = $(section)
    $section.html(spin)
    const css = {}
    if (this._options.zIndex) {
      css.zIndex = this._options.zIndex
    }
    if (this._options.background) {
      css.background = this._options.background
    }
    $section.css(css)
    return $section
  }

  static get NAME() {
    return NAME
  }

  static jQueryInterface(config, action) {
    return this.each(function() {
      const $element = $(this)
      let data = $element.data(DATA_KEY)

      if (!data) {
        data = new Loading(this, typeof config === 'string' ? {} : config)
        $element.data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        data[config](this)
      } else if (action) {
        data[action](this)
      } else {
        data.open()
      }
    })
  }
}

export default Loading
