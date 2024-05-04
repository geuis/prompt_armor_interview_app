import React from 'react';
import { useEffect, useState } from 'react';
import { PromptArmorContext } from './context';
import { 
  apiServerUrl,
  extensionStorageKey, 
  store 
} from '../shared/store.js';

const PromptArmorProvider = ({ children }) => {
  const resetSession = () => {
    setFamilyCode(null);
    setMembers([]);
    setUserId(null);
    setUserName(null);
    setSignedIn(false);

    store.clear(extensionStorageKey);
  };

  const getFamilyByCode = async (typedFamilyCode) => {
    try {
      const response = await fetch(`${apiServerUrl}/api/members/${typedFamilyCode}`);

      if (response.status === 200) {
        const data = await response.json();

        // update the local store
        store.set({
          familyCode: data.code
        });

        // update react state
        setFamilyCode(data.code);
        setMembers(data.members);

        if (errorMessage) {
          setErrorMessage();
        }

        return;
      }

      setErrorMessage('Family code not found.');
      throw new Error();
    } catch (err) {
      throw err;
    }

  };

  const createFamily = async () => {
    try {
      const response = await fetch(`${apiServerUrl}/api/members`, { method: 'post' });

      if (response.status === 200) {
        const data = await response.json();

        store.set({
          familyCode: data.code
        });

        setFamilyCode(data.code);
        setMembers(data.members);
      }
    } catch (err) {
      throw err;
    }
  };

  const newMember = async (familyId, memberName) => {
    try {
      const response = await fetch(`${apiServerUrl}/api/members/${familyId}`, { method: 'post', body: JSON.stringify({ memberName }) });

      if (response.status === 200) {
        const data = await response.json();

        updateUser(data.id, data.name);
      }
    } catch (err) {
      throw err;
    }
  };

  const updateUser = async (id, name) => {
    store.set({
      userId: id,
      userName: name
    });

    setUserId(id);
    setUserName(name);
  };

  const [errorMessage, setErrorMessage] = useState();
  const [signedIn, setSignedIn] = useState(false);
  const [familyCode, setFamilyCode] = useState();
  const [members, setMembers] = useState([]);
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();

  const value = {
    actions: {
      newMember, createFamily, getFamilyByCode, resetSession, updateUser,
      setErrorMessage, setFamilyCode, setMembers, setSignedIn, setUserId, setUserName
    },
    state: { errorMessage, familyCode, members, signedIn, userId, userName }
  };

  useEffect(() => {
    try {
      (async () => {
        const famCode = await store.get('familyCode');
        const uid = await store.get('userId');
        const uname = await store.get('userName');

        // try to set initial conditions from stored state
        if (famCode) {
          setFamilyCode(famCode);
        }

        if (uid) {
          setUserId(uid);
        }

        if (uname) {
          setUserName(uname);
        }

        // in the case where the family code exists but members hasn't been set, such as if the app reloads at the "pick a user" state, 
        // fetches the list for the given familyCode
        if (familyCode && !userId && !userName) {
          getFamilyByCode(familyCode);
        }

        if (userId && userName && familyCode) {
          setSignedIn(true);
        } else {
          setSignedIn(false);
        }
      })();
    } catch (err) {
      throw err;
    }
  }, [familyCode, userName, userId, signedIn]);

  return (
    <PromptArmorContext.Provider value={value}>
      {children}
    </PromptArmorContext.Provider>
  );
};

export {
  PromptArmorProvider
};
