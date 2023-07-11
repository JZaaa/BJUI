/**
 * BJUI 框架相关插件兼容处理
 * 使用方法： BJUI.ModuleFixed.func
 */
+(function($) {
  'use strict'

  function ModuleFixed() {
  }

  /**
   * 销毁实例，一般在dialog/navtab重载或关闭前使用
   * @param $selector 需处理的dialog/navtab jquery对象
   */
  ModuleFixed.prototype.destroyModules = function($selector) {
    if (!$selector instanceof jQuery) {
      return
    }
    $(document).trigger(BJUI.eventType.destroyModules, $selector)
    $selector.find('[data-bj-panel-dom]').trigger(BJUI.eventType.destroyPanel, $selector)
    try {
      // 查询是否存在vue节点，存在则触发卸载挂载实例
      if (typeof Vue !== 'undefined') {
        if (Vue.version.startsWith('2.')) {
          $selector.find(BJUI.pluginConfig.vue.unmountAttr).each(function () {
            this.__vue__ && this.__vue__.$destroy()
          })
        } else if (Vue.version.startsWith('3.')) {
          if (BJUI.pluginConfig.vue.autoUnmount) {
            $selector.find('[data-v-app]').each(function () {
              this.__vue_app__ && this.__vue_app__.unmount()
            })
          } else {
            $selector.find(BJUI.pluginConfig.vue.unmountAttr).each(function () {
              this.__vue_app__ && this.__vue_app__.unmount()
            })
          }
        }
      }

      // ie9 uploadify 销毁
      var uploadify = $selector.find('.bjui-upload > .uploadify')
      if (uploadify.length) {
        uploadify.uploadify('destroy')
      }
      // colorpicker 销毁
      var colorpicker = $selector.find('[data-toggle="colorpicker"]')
      if (colorpicker.length) {
        colorpicker.colorpicker('destroy')
      }
      var selectpicker = $selector.find('[data-toggle="selectpicker"]')
      if (selectpicker.length) {
        selectpicker.selectpicker('destroy')
      }
    }
     catch (e) {
      BJUI.debug(e)
    }
  }

  BJUI.ModuleFixed = new ModuleFixed()

})(jQuery)
