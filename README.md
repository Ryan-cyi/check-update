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
import {CheckHtml} from 'html-check-update'

const check = new CheckHtml({delay: 10000, confirm:() => true})

// confirm should return boolean 
// if true. will reload current page
// elst not reload

// start check
check.start()

```
