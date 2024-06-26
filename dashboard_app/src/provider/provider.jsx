import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { PromptArmorContext } from './context';

const extensionName = 'Prompt Armor Web Tracking';
const apiServerHost = 'http://localhost';
const apiServerPort = 3000;
const apiServerUrl = `${apiServerHost}:${apiServerPort}`;

const PromptArmorProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState();
  const [signedIn, setSignedIn] = useState(false);
  const [familyCode, setFamilyCode] = useState();
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [selectedTimeInterval, setSelectedTimeInterval] = useState(1);
  const prevSelectedTimeIntervalRef = useRef();
  const [siteTimes, setSiteTimes] = useState();
  const [chromeExtensionId, setChromeExtensionId] = useState();

  const value = {
    actions: {
      setSelectedTimeInterval
    },
    state: { chromeExtensionId, errorMessage, familyCode, selectedTimeInterval, signedIn, siteTimes, userId, userName }
  };

  useEffect(() => {
    const handleMessage = (ev) => {
      if (ev.source !== window || ev.data?.source !== 'webtracking_extension') {
        return;
      }

      if (ev.data.extensionId) {
        setChromeExtensionId(ev.data.extensionId);
      }
    };

    // request to the extension to get its extension id
    window.postMessage({ source: 'dashboard_app', message: 'get_extension_id' });

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [chromeExtensionId]);

  useEffect(() => {
    try {
      (async () => {
        if (!chrome.runtime) {
          setErrorMessage(`Only Chrome is currently supported and the ${extensionName} extension is required to access this page.`);
          return false;
        }

        if (!chromeExtensionId) {
          return false;
        }

        const uid = await chrome.runtime.sendMessage(chromeExtensionId, { type: 'store', action: 'get', key: 'userId' });
        const uname = await chrome.runtime.sendMessage(chromeExtensionId, { type: 'store', action: 'get', key: 'userName' });
        const famcode = await chrome.runtime.sendMessage(chromeExtensionId, { type: 'store', action: 'get', key: 'familyCode' });

        setUserId(uid);
        setUserName(uname);
        setFamilyCode(famcode);

        const authenticated = uid && uname && famcode;

        setSignedIn(authenticated);

        if (!authenticated) {
          setErrorMessage(`Please sign in via the ${extensionName} extension.`);
          return;
        }

        // fetch times for interval
        if (prevSelectedTimeIntervalRef.current !== selectedTimeInterval && userId) {
          const response = await fetch(`${apiServerUrl}/api/times/${userId}/${selectedTimeInterval}`);
          const times = await response.json();

          setSiteTimes((val) => structuredClone(times));

          prevSelectedTimeIntervalRef.current = selectedTimeInterval;
        }
      })();
    } catch (err) {
      throw err;
    }
  }, [selectedTimeInterval, userId, chromeExtensionId]);

  return (
    <PromptArmorContext.Provider value={value}>
      {children}
    </PromptArmorContext.Provider>
  );
};

export {
  PromptArmorProvider
};
