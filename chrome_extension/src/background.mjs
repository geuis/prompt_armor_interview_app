import { store } from "./shared/store";

try {
  const handler = (request, sender, sendResponse) => {
    const { type, action, key, value } = request;

    if (type === 'store') {
      (async () => {
        let results;

        if (action === 'get') {
          results = await store[action](key);
        }

        if (action === 'set') {
          results = await store[action]({
            [key]: value
          });
        }

        if (action === 'clear') {
          results = await store[action]();
        }

        sendResponse(results);
      })();
    }

    return true;
  };

  chrome.runtime.onMessage.addListener(handler);
  chrome.runtime.onMessageExternal.addListener(handler);
} catch (err) {
  console.error(err);
}
