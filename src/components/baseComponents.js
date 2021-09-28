import { executeAfterTransition } from '@/utils'
import $ from 'jquery'

/**
 * 基础模块
 */
class BaseComponents {
  constructor(element) {
    if (!element) {
      return
    }
    element = $(element)
    if (!element.length) {
      return
    }
    this._element = element[0]
    this._$element = element
  }

  dispose() {
  }

  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated)
  }

  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!')
  }

  static get DATA_KEY() {
    return `bj.${this.NAME}`
  }

  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`
  }
}

export default BaseComponents
