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
    try {
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
    } catch (e) {
      BJUI.debug(e)
    }
  }

  BJUI.ModuleFixed = new ModuleFixed()

})(jQuery)
