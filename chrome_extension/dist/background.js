import{s as a}from"./assets/store-DJAzFX_o.js";try{const r=(n,l,o)=>{const{type:i,action:e,key:s,value:c}=n;return i==="store"&&(async()=>{let t;e==="get"&&(t=await a[e](s)),e==="set"&&(t=await a[e]({[s]:c})),e==="clear"&&(t=await a[e]()),o(t)})(),!0};chrome.runtime.onMessage.addListener(r),chrome.runtime.onMessageExternal.addListener(r)}catch(r){console.error(r)}