// these are manually copied from ./src/shared/store.js contentScript.js because vite isn't configured to import them. 
// Problems with inlining not being supported. This process would have a permanent solution in a production app.
const apiServerHost = 'http://localhost';
const apiServerPort = 3000;
const apiServerUrl = `${apiServerHost}:${apiServerPort}`;
const extensionStorageKey = 'promptArmorState';

const store = {
  get: async (key) => {
    const response = await chrome.runtime.sendMessage({
      type: 'store',
      action: 'get',
      key: key
    });

    return response;
  },
  set: async (key, value) => {
    const response = await chrome.runtime.sendMessage({
      type: 'store',
      action: 'set',
      key: key,
      value: value
    });

    return response;
  },
  clear: async () => {
    const response = await chrome.runtime.sendMessage({
      type: 'store',
      action: 'clear',
      key: key
    });

    return response;
  }
};

// when visible starts, start tracking
// while visible, every 10 seconds add new end/start objects to times array in storage.
// every 60 seconds flush the times array to remote api. This resets the local times array
// when visibility becomes hidden, flush times to remote. This resets the local times array

// Using visibility state as "visible" for the purpose of tracking screentime. Some websites can run in the background while not visible, 
// such as listening to music or podcasts, but for the purposes of this extension those activities aren't being included as "screentime".

const updateTimes = async () => {
  try {
    // get the userId each time in the event the user changes
    const userId = await store.get('userId');
    const host = window.location.host;

    if (!userId || !host) {
      console.warn('no userId/host found');
      return;
    }

    const timesObj = (await store.get('times')) || {
      [userId]: {
        [host]: []
      }
    };

    if (!timesObj[userId][host]) {
      timesObj[userId][host] = [];
    }

    timesObj[userId][host].push(Date.now());

    // check if any times were stored. If so, then flush to remote and begin tracking again.
    if (timesObj[userId][host].length > 10) {
      flush(userId, host, timesObj);
    }

    // store the times
    await store.set('times', timesObj);
  } catch (err) {
    console.error(err);
  }
};

const flush = async (userId, host, timesObj) => {
  try {
    if (!timesObj[userId][host]) {
      timesObj[userId][host] = [Date.now()];
    }

    const post = await fetch(`${apiServerUrl}/api/times/${userId}/${host}`, { method: 'post', body: JSON.stringify(timesObj[userId][host]) });

    timesObj[userId][host] = [];

    await store.set('times', timesObj);
  } catch (err) {
    throw err;
  }
};

let trackingInterval;
const main = async () => {
  try {
    if (document.visibilityState === 'visible') {
      // prevent duplicate intervals
      if (trackingInterval) {
        return;
      }

      console.log('start tracking');

      const userId = await store.get('userId');
      const host = window.location.host;

      if (!userId || !host) {
        console.warn('Please log into the PromptArmorWebtracking extension.');
        return;
      }

      // flush any previously stored times in case they weren't previously sent
      const timesObj = await store.get('times');

      if (timesObj) {
        flush(userId, host, timesObj);
      }

      trackingInterval = setInterval(() => {
        updateTimes();
      }, 1000);

      // run immediately, then interval will pick up.
      updateTimes();
    } else {
      console.log('stop tracking');

      clearInterval(trackingInterval);
      trackingInterval = null;

      // flush to remote
      const timesObj = await store.get('times');

      if (timesObj) {
        flush(userId, host, timesObj);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

window.addEventListener('visibilitychange', () => main());

main();

window.addEventListener('message', (ev) => {
  if (ev.source !== window || ev.data?.source !== 'dashboard_app') {
    return;
  }

  window.postMessage({ source: 'webtracking_extension', extensionId: chrome.runtime.id });
});