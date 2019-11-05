# 更新日志
-------------------------------------------
## master 
### BugFixed
- 修复`dialog`/`navtab`组件`[data-data]`未格式化问题
- 新增`lookup`查找带回插件配置项
-------------------------------------------
## v1.1.4
### BugFixed
- 修复`doAjax`组件`[data-data]`格式化错误问题

### Improvements
- 新增`doexport`/`doExportChecked`组件使用type、data属性。
- 新增`navtab`组件默认回调设置`tabid: false`时不刷新当前标签页
- 新增bjui.debug为false时，`404`/`500`错误弹窗处理
- 新增部分拓展函数

### Update
- `jquery.fileDownload`插件升级至 v1.4.5

-------------------------------------------
## v1.1.3
### Improvements
- 新增\[ :text, :password, textarea, :button, a.btn \] `size`属性`%`支持
- `doAjaxChecked`组件会根据请求类型设置参数传递类型，get参数会以`Query String Parameters`请求,其他会以`Form Data`方式请求

### Bug Fixed
- 修复`uploadify`组件成功回调参数问题
- 修复`doAjaxChecked`组件`idname`未设置问题
- 修复`doAjaxChecked`组件`[data-data]`格式化错误问题
- 修复`string.setUrlParam()`函数错误运行问题

### Other
- `Material-Blue`主题重命名为 `Teal`
-------------------------------------------
## v1.1.2

### Improvements
- 新增ajax请求失败时进度条关闭处理
- 新增`JSON编辑器`，使用请查看在线文档
- 新增`Clipboard`粘贴插件，使用请查看在线文档
-------------------------------------------
## v1.1.1

### Improvements
- 简化配置
    - 时钟可在初始化时设定是否显示
    - `bjui-slidebar`插件添加原生侧边栏菜单点击事件,注意：ztree侧边栏菜单仍需手动配置方法
- 部分代码优化

### Bug Fixed
- 修复`dialog`全局配置失效问题

-------------------------------------------
## v1.1.0

### Improvements
- 新增BJUI插件自动压缩脚本`bin/bjui-js-optimize.bat`
- `jquery.cookie.js`合并至插件
- 默认不加载`query.iframe-transport.js`、`html5shiv.min.js`、`respond.min.js`、`swfupload.min.js`插件，如需要请手动引入
- BJUI插件代码优化
- 刷新(关闭)Navtab(dialog)`uploadify`、`colorpicker`自动销毁
- 新增`dialog`全局配置


### Bug Fixed
- 修复表格无排序下`reloadForm`调用错误
- 修复可编辑表格`selectpicker`插件只读状态下状态错误
- 修复可编辑表格`selectpicker`插件首次验证失效问题
- 修复可编辑表格`upload`插件只读状态未隐藏问题
- 修复`tags`插件输入为空时错误
- 修复`uploadify`插件IE9下初始化错误
- 修复`swfupload`与`uploadify`插件调用Flash错误 

-------------------------------------------
## 2019-02-13

### Improvements

- Material-*主题美化
    - `button` 样式优化

### Bug Fixed
- 修复多框架下主题设置冲突问题

-------------------------------------------
## 2019-01-29

### Improvements
- 新增\[b-shadow\]阴影全局样式
- `Material-*主题` `button` 样式美化，新增Flat风格按钮样式
- `Material-*主题` 日历样式美化
- 新增框架新特性文档

-------------------------------------------
## 2019-01-28

### Bug Fixed
- 修复高版本浏览器中`jquery.cookie`无效错误。引入`js.cookie`插件,重新封装`jquery.cookie.js`插件替换原插件
- 修复框架初始化设置默认主题无效

### Update
- jquery 升级至 v1.12.4

-------------------------------------------
## 2019-01-25

### Improvements
- 新增`Material-Blue`主题
- 新增 `httpCode: 403` 处理，默认弹出重新登录窗口
- 新增 dialog\[callback.tabid\] 当tabid为空时，刷新本页面，设置为'false'则不刷新

### Bug Fixed
- 移除部分插件 Source Map
- 修复select下拉框样式问题
- bootstrap 升级至 v3.4.0, 并修复tooptip插件未获取对象报错问题
- 修复navtab清空查询无法重置排序问题

-------------------------------------------
## 2019-01-18

### Bug Fixed
- 项目瘦身
- 修复bjui-lookup组件未实例化前添加newurl无效问题

### Update 
- 删除DragSort拖拽插件
- zTree 插件升级至 v3.5.39
- kindeditor 升级至 v4.1.12, 添加IE11支持
- bootstrap-select升级至 v1.12.4
- nice-validator 升级至 v1.1.4

--------------------------------------------
## 2019-01-17

- 更改默认视图为宽版
- 删除图表部分，请手动引入图表
- 修复代码高亮插件引入错误问题
- 添加代码压缩说明


------------------------------

更新内容 : 
- bootstrap与其相关icon等更新版本为3.3.7
- colorpicker更新版本为2.5.1
- nice-validator更新版本为1.0.10，请查看新版本文档
- icheck更新版本为1.0.2
- ~~echarts更新版本为3.6.1(最低支持ie8)，删除原框架Hcharts 与 echarts2插件。
  更新版本只加入基础图表，并未设置主题，仅支持jquery调用(原框架调用方法无效)~~
- bootstrap-selectpicker更新版本为1.12.2,并对原css进行少量调整以兼容框架
- font-awesome更新版本为4.7.0
- jquery更新版本为1.11.3,请勿回滚版本，回滚可能导致以上更新插件无法使用等问题
- 请根据此文件下的index.html 或 index_tree.html 加载框架
