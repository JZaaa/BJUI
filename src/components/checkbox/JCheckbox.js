import BaseComponents from '@/components/baseComponents'
import $ from 'jquery'

const NAME = 'checkbox'
const DATA_KEY = 'bj.checkbox'

class JCheckbox extends BaseComponents {
  constructor(element, options) {
    super(element)
    this._create()
  }

  // Public

  // Private

  _create() {
    const label = this._$element.data('label')

    const type = this._$element.data('switch') ? 'switch' : this._$element.attr('type')

    let typeClass = ''

    switch (type) {
      case 'checkbox':
        typeClass = ''
        break
      case 'radio':
        typeClass = 'p-round'
        break
      case 'switch':
        typeClass = 'p-switch'
        break
    }

    const $box = $(`
        <div class="pretty p-default ${typeClass}"></div>
      `)

    this._$element.wrap($box)

    this._$checkbox = this._$element.parent()

    this._$checkbox.append(`
     <div class="state p-primary-o">
        <label>${label}</label>
     </div>
    `)

    // this._$element.hide()
    // console.log(this._$element)
  }

  static get NAME() {
    return NAME
  }

  static jQueryInterface(config, relatedTarget) {
    return this.each(function() {
      const $element = $(this)
      let data = $element.data(DATA_KEY)

      if (!data) {
        data = new JCheckbox(this)
        $element.data(DATA_KEY, data)
      }

      if (config === 'close') {
        data[config](this)
      }
    })
  }
}

export default JCheckbox

