# Decent simple description of how to get this barebones working
https://arglee.medium.com/chrome-extensions-using-vite-typescript-react-stepwise-process-6d013f5332b9

# Automatically rebuild to /dist with nodemon. Useful in extension development
nodemon --watch src --exec "npm run build"


https://developer.chrome.com/docs/extensions/reference/api/identity
need identity.email manifest permission 
https://noidea.dog/blog/chrome-identity-api

Chrome idle
https://developer.chrome.com/docs/extensions/reference/api/idle

This is ChromeOS only
https://developer.chrome.com/docs/extensions/reference/api/loginState


- Can have multiple users on the same browser
  * Can only identify individual users reliably if they have unique browser profiles, or if each user manually toggles their identify via a mechanism that's built into the extension
  * Extensions can't be installed under guest profiles.
  * Extensions are installed per-profile. UserA and UserB, each with a separate profile, would need to separately install the extension.

    
- Need to identify the same user across different browser installs

Page visibility and page has focus
- page visible in the background but non-focused is negatory


Data relationships:
Family id/name
- members id/name1/?
  - abc.com 2 hours
  - youtube.com 5 hours
- members id/name2/?
  - xyz.com 1 hours
  - steak.com 9 hours
- members id/name3/?
  - youtube.com 23 hours
  - twitch.com 9 hours