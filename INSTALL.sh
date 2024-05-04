 #!/usr/bin/env bash

# install packages
cd api_server
npm install

cd ../dashboard_app
npm install

cd ../chrome_extension
npm install

# build chrome extension
npm run build

# start the api server and dashboard app
cd ../
(trap 'kill 0' SIGINT; cd api_server && node server.mjs & cd dashboard_app && npm run dev & wait) 
