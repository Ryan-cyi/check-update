Automatically check for updates to the current site

## install

### npm
```
npm install --save html-check-update 
```

### pnpm
```
pnpm install --save html-check-update 
```
## Example

```js
import {HtmlCheckUpdate} from 'html-check-update'

new HtmlCheckUpdate({delay: 10000})

// confirm should return boolean 
// if true. will reload current page
// elst not reload

```
