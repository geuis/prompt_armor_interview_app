const o="http://localhost";const r=`${o}:3000`,t="promptArmorState",s={get:async a=>{let e;return chrome.storage?e=(await chrome.storage.local.get(t))[t]||{}:(e=localStorage.getItem(t)||"{}",e&&(e=JSON.parse(e))),e[a]},set:async a=>{let e;chrome.storage?e=(await chrome.storage.local.get(t))[t]||{}:(e=localStorage.getItem(t)||"{}",e&&(e=JSON.parse(e))),e=Object.assign(e,a),chrome.storage?await chrome.storage.local.set({[t]:e}):localStorage.setItem(t,JSON.stringify(e))},clear:async()=>{chrome.storage?await chrome.storage.local.remove(t):localStorage.removeItem(t)}};export{r as a,t as e,s};