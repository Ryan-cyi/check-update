
单页面重新部署后通知用户刷新网页

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
