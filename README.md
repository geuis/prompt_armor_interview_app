# Automatic installation
There is an `INSTALL.sh` script in the root directory.
Running it should automatically install and run everything (except for the Chrome extension).
The script will automatically build the extension into `chrome_extension/dist`.

# Chrome extension installation

Load the extension unpacked:
* Visit chrome://extensions/
* Click "Load unpacked"
* Load the `chrome_extension/dist` directory.

(Chrome doesn't seem to allow packed crx extensions to be enabled unless they're published to the Chrome store.)

# If the automatic install script doesn't work for some reason, below are the manual steps.

# Run the api server

```
cd api_server
npm install
node server.mjs
```

For this demo, the api server uses a locally stored json file as the "database" located in `api_server/data/database.json`.
A clean, empty version of the json file is in the same data directory labeled `database_empty.json`.
If a fresh db is needed, simply rename a copy of database_empty.json to `database.json`, or copy/paste the contents to replace it.

# Run the dashboard web app
```
cd dashboard_app
npm install
npm run dev
```

# First time use
After getting the extension installed by loading unpacked, and getting the api server and dashboard web app running, open the extension popup and follow the steps to create a new family and then create a new member.

Tracking will start on any page you visit after signing in.
