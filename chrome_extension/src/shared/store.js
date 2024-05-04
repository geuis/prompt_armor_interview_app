// these are manually copied over to contentScript.js because vite isn't configured to import them. Problems with inlining not being supported.
export const apiServerHost = 'http://localhost';
export const apiServerPort = 3000;
export const apiServerUrl = `${apiServerHost}:${apiServerPort}`;
export const extensionStorageKey = 'promptArmorState';

// adapter that allows for easier development in regular web environment and also supports chrome extension mode.
export const store = {
  // data is namespaced under the "extensionStorageKey" value.
  get: async (key) => {
    let tempData;

    if (chrome.storage) {
      tempData = (await chrome.storage.local.get(extensionStorageKey))[extensionStorageKey] || {};
    } else {
      tempData = localStorage.getItem(extensionStorageKey) || '{}';

      if (tempData) {
        tempData = JSON.parse(tempData);
      }
    }

    return tempData[key];
  },
  set: async (data) => {
    let tempData;

    if (chrome.storage) {
      tempData = (await chrome.storage.local.get(extensionStorageKey))[extensionStorageKey] || {};
    } else {
      tempData = localStorage.getItem(extensionStorageKey) || '{}';

      if (tempData) {
        tempData = JSON.parse(tempData);
      }
    }

    tempData = Object.assign(tempData, data);

    if (chrome.storage) {
      await chrome.storage.local.set({ [extensionStorageKey]: tempData });
    } else {
      localStorage.setItem(extensionStorageKey, JSON.stringify(tempData));
    }
  },
  clear: async () => {
    if (chrome.storage) {
      await chrome.storage.local.remove(extensionStorageKey);
    } else {
      localStorage.removeItem(extensionStorageKey);
    }
  }
};
