单页面重新部署如何通知用户刷新网页?

作为单页面应用，当有更新内容发布线上之后，用户还停留在之前浏览的界面进行操作。如果有涉及到一些比较重要的更新时，用户并不能提前感知到有新的内容发布，或者跳转页面的时候有时候js连接hash变了导致报错跳不过去，导致体验感降低或者无法体验新的功能。

目前解决的方案有很多种，如通过websocket实时与后端程序进行通讯，当前端的站点部署完成之后，给后端发个通知，前端站点接收到消息之后，通过提示用户有新的站点内筒更新。 但是这个方案设计的环节比较多，需要运维、后端、前端三方的同事一同完成这个事情。

大致流程是通过运维通过构建完成的钩子，前端站点部署成功之后， 通过消息 发送给后端， 后端接收到这个消息再通过websocket通知前端站点进行用户提示更新。设计的环节比较多，那如何减少环节来达成此效果呢?

通过纯前端可以实现这个功能。每次构建完后，通过打包工具vite或者webpack生成json文件，里面就放当前构建的hash值，然后在前端站点里面去定时请求(轮询)这个json文件内容的hash是否有改变。这种方式是ok的，但是需要去实现构建工具的钩子进行配置。

另外一种方式是通过请求html文件，来检查html中script的内容是有改变。 如果有改变就提示用户有新的内容可以更新。

### 安装依赖

#### npm

```shell
npm install --save html-check-update 
```

#### pnpm

```shell
pnpm install --save html-check-update 
```

#### yarn

```shell
yarn add html-check-update 
```

## 示例

在项目入口如

```js
import { HtmlCheckUpdate } from 'html-check-update'

new HtmlCheckUpdate({delay: 600000, interval: 15000})
// path -> route
```

### interval 

设置每次检查更新请求的时间间隔

### confirm - function

### path 子站点的路径设置

使用场景为 微前端 或者 子站点应用

如:`www.xxxx.com/asite` 活 `www.xxxx.com/bsite` 这些子应用时

需要设置 `path` 的值 `/asite` 或者 `/bsite`,

### delay

当忽略本次更新，设置间隔下次更新的时间

### message - string

设置弹出框的提示语, 默认 `A new version is released and needs to be refreshed.`

![screen-snapshot1.png](https://cdn.wekic.com/_blog/1675327262789-screen-snapshot1.png)

### 设置按钮颜色

使用css变量 读取 `--primary-color`, 默认按钮颜色 `#409eff`

## 示例配置

```js
new HtmlCheckUpdate({
        delay: 10000,
        interval: 3000,
        ignoreText: "延迟",
        confirmText: "立即刷新",
        message: "检测到有新版本发布, 是否需要刷新?"
})
```

效果图

![screen-snapshot-2.png](https://cdn.wekic.com/_blog/1675327193660-screen-snapshot-2.png)
