import 'pretty-checkbox/src/pretty-checkbox.scss'

import JCheckbox from './JCheckbox'
import { defineJQueryPlugin } from '@/utils'

defineJQueryPlugin(JCheckbox)

export {
  JCheckbox
}
