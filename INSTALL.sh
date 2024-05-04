 #!/usr/bin/env bash

# install packages
cd api_server
rm ./data/database.json
cp ./data/database_empty.json ./data/database.json
npm install

cd ../dashboard_app
npm install

cd ../chrome_extension
rm -rf ./dist
mkdir ./dist
npm install

# build chrome extension
npm run build

# start the api server and dashboard app
cd ../
(trap 'kill 0' SIGINT; cd api_server && node server.mjs & cd dashboard_app && npm run dev & wait) 
