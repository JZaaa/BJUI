# 更新日志
-------------------------------------------
## master

### Improvements
- 样式布局优化
- 新增单标签页功能
- 左右菜单布局添加默认菜单监听

### fixed
- 修复bjui-slidebar tooltip 插件销毁错误问题

### Update
- 升级Bootstrap为 v3.4.1

## v1.4.0

### Improvements

- 修改默认字体大小为14px，修改默认字体与行高
- 新增全局字体大小样式
- 新增全局间距样式
- 新增一种表单样式，并添加搭配验证样式
- 优化iCheck生成方式，现在如果未指定id，则自动生成id

### Update

- iCheck 插件升级为 v1.0.3
- nice-validator 升级为 v1.1.5

-------------------------------------------
## v1.3.1

### fixed

- 修复低版本IE不兼容错误

-------------------------------------------

## v1.3.0

### Improvements

- 新增左右导航菜单样式，说明请查看【在线文档】-【框架介绍】-【左右导航菜单】，示例可参考**index_left_menu.html**

-------------------------------------------

# 更新日志
-------------------------------------------
## v1.2.1

### BugFixed

- 修复固定表格在页面大小变化后无法拉伸问题

-------------------------------------------

## v1.2.0

### Improvements

- 新增tabs组件远程加载搜索分页支持，现在远程加载功能由局部刷新组件处理

-------------------------------------------
## v1.1.10

### Improvements

- `upload`上传组件`onUploadBefore` 参数新增隐藏input文件上传jQuery对象回调
- `dialog`/`navtab`关闭时，销毁selectpicker自动实例化的插件，手动实例化的插件仍然需要自行销毁

-------------------------------------------
## v1.1.9

### Improvements

- 新增`lookup`插件`open` `addBtn`属性，用于统一自动初始化与api实例化组件表现

-------------------------------------------
## v1.1.8
### Improvements

- 新增ajax提交表单附加参数extra，**注意: 添加此设置请求contentType将会转换成application/json**
  
- 完善`lookup`查找带回插件`beforeSelect`选择回调方法，现在将返回三个参数，增强多选类型的个性化

``` js
$(this).lookup({
  beforeSelect: function(val, valArray, type) {
    // 默认赋值数据，如：{pid: "1,2", name: "自由职业,工程师"}
    console.log(val)
    
    // 选中的数据Array格式，如： [{pid: "1", name: "自由职业"},{pid: "2", name: "工程师"}]
    // 注意：单选也返回array类型，如[{pid: "1", name: "自由职业"}]
    console.log(valArray)
    
    // 是否追加, 通过lookupType设置，!!type为false则不追加
    console.log(type)
    
    // 若返回false，则本次选择无效，lookup不关闭，不默认赋值
    return false
  }
})
```

-------------------------------------------

## v1.1.7
### Improvements

- 新增内置工具集
- 新增KindEditor全局配置
- `navtab`组件新增`closeOtherTab`方法

## v1.1.6
### Improvements

- 新增`boolcheck`插件，利用`[data-toggle="boolcheck"]`实例化，将会对check插件进行`icheck`组件实例化，并生成隐藏input，生成Input根据check组件状态返回1或0,该组件用于解决在`dialog/navtab`上check搜索选中后无法取消的问题

-------------------------------------------
## v1.1.5
### BugFixed
- 修复`dialog`/`navtab`组件`[data-data]`未格式化问题


### Improvements
- 新增`lookup`查找带回插件`arrayfix`配置项
- 新增`lookup`查找带回插件`beforeSelect`选择回调方法
- 新增`upload`组件上传前`onUploadBefore`与上传完成`onUploadComplete`回调函数

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
