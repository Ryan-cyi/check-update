
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

Set the popup message. default is `A new version is released and needs to be refreshed.`

![image](./screen-snapshot.png)
