## 程序实现

#### 本小程序技术栈：

* 后端采用：MySQL + django

* 后端地址：https://gitee.com/qixiao/scan_aust

* 前端采用：小程序语法 + colorui

* 前后端交互

    后端向前端传递数据采用 json 字典作为数据流载体
    
    前端向后端请求数据采用 POST 方法

## 海运入库小程序代码文件说明
```
├─colorui           小程序第三方样式库：https://github.com/weilanwl/ColorUI
│  └─components
├─image             所有项目所需图片
├─pages
│  ├─error          请求出错的返回页面
│  ├─index          主页，用户端和工作人员端显示不同
│  │  ├─newform         用户端，未注册用户注册填写表单，注册
│  │  ├─notice          用户端，返回海运条款
│  │  └─scanitem        工作人员端，快递扫码入库时，填写商品信息的页面
│  ├─search         查询页，用户端和工作人员端显示不同
│  │  ├─address         用户端，显示澳大利亚仓库地址
│  │  ├─allgoods        用户端，显示该用户所有商品
│  │  ├─fillgoods       工作人员端，显示所有未补全的商品
│  │  ├─oneuser         工作人员端，输入一个用户编号，显示该用户所有商品
│  │  ├─overview        工作人员端，显示一段时间所有商品统计情况
│  │  └─refund          工作人员端，显示退货商品信息
│  └─success        请求成功的返回页面
└─utils
  └─common.js           一些常用函数，如请求后端、截断字符，使用时，直接调用即可
```
