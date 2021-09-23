module.exports = [
  // 基础文件
  { from: 'src/assets', to: 'assets' },

  // plugin 文件
  { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css', to: 'plugins/bootstrap/css/bootstrap.min.css' },
  { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css.map', to: 'plugins/bootstrap/css/bootstrap.min.css.map' },
  { from: 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', to: 'plugins/bootstrap/js/bootstrap.bundle.min.js' },
  { from: 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map', to: 'plugins/bootstrap/js/bootstrap.bundle.min.js.map' },

  { from: 'node_modules/bootstrap-colorpicker/dist', to: 'plugins/bootstrap-colorpicker' },
  { from: 'node_modules/bootstrap-icons/font/bootstrap-icons.css', to: 'plugins/bootstrap-icons/bootstrap-icons.css' },
  { from: 'node_modules/bootstrap-icons/font/fonts', to: 'plugins/bootstrap-icons/fonts' },

  { from: 'node_modules/bootstrap-select/dist/css', to: 'plugins/bootstrap-select/css' },
  { from: 'node_modules/bootstrap-select/dist/js/bootstrap-select.min.js', to: 'plugins/bootstrap-select/js/bootstrap-select.min.js' },
  { from: 'node_modules/bootstrap-select/dist/js/bootstrap-select.min.js.map', to: 'plugins/bootstrap-select/js/bootstrap-select.min.js.map' },
  { from: 'node_modules/bootstrap-select/dist/js/i18n/defaults-zh_CN.js', to: 'plugins/bootstrap-select/js/i18n/defaults-zh_CN.js' },

  { from: 'node_modules/jquery/dist/jquery.min.js', to: 'plugins/jquery/jquery.min.js' },
  { from: 'node_modules/jquery/dist/jquery.min.map', to: 'plugins/jquery/jquery.min.map' },

  { from: 'node_modules/nice-validator/dist', to: 'plugins/nice-validator' },
  { from: 'node_modules/@ztree/ztree_v3/js/jquery.ztree.all.min.js', to: 'plugins/ztree_v3/js' }
]
