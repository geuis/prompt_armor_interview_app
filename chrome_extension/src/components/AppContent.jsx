import React from 'react';
import { usePromptArmor } from "../provider/use";
import FamilyCode from "./FamilyCode";
import Members from './Members';

const AppContent = () => {
  const {
    actions: { resetSession },
    state: { errorMessage, familyCode, userId, userName, signedIn }
  } = usePromptArmor();

  return (
    <div>
      <h1>PromptArmor Family Webtime Tracking</h1>

      {errorMessage &&
        <div className="error-msgs">
          {errorMessage}
        </div>
      }

      {!signedIn && !familyCode && <FamilyCode />}
      {!signedIn && familyCode && !userId && <Members />}

      {signedIn && (
        <section className="signed-in">
          <div>Hey {userName}, welcome back.</div>
        </section>
      )}

      {(signedIn || familyCode || userId) && (
        <div>
          <button onClick={() => resetSession()}>Sign out</button>
        </div>
      )}
    </div>
  );
};

export default AppContent;
