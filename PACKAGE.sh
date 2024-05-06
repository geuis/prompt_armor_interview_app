 #!/usr/bin/env bash

 rm -rf ./api_server/node_modules
 rm -rf ./api_server/data/database.json
 rm -rf ./dashboard_app/node_modules
 rm -rf ./chrome_extension/node_modules
 rm -rf ./chrome_extension/dist
 mkdir ./chrome_extension/dist
 
zip -r promparmor_takehome.zip .
