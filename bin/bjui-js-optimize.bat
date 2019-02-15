@echo off
chcp 65001

echo 按下[ENTER]自动压缩BJUI插件，请自行备份bjui-all.js文件
pause

cd %~dp0
cd ..\BJUI\js

uglifyjs jquery.cookie.js bjui-core.js bjui-regional.zh-CN.js bjui-frag.js bjui-extends.js bjui-basedrag.js bjui-slidebar.js bjui-contextmenu.js bjui-navtab.js bjui-dialog.js bjui-taskbar.js bjui-ajax.js bjui-alertmsg.js bjui-pagination.js bjui-util.date.js bjui-datepicker.js bjui-ajaxtab.js bjui-datagrid.js bjui-tablefixed.js bjui-tabledit.js bjui-spinner.js bjui-lookup.js bjui-tags.js bjui-upload.js bjui-theme.js bjui-initui.js bjui-plugins.js -c -m -o bjui-all.js

echo 压缩完成！
pause & exit
