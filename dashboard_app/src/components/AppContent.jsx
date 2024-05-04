import React from 'react';
import { usePromptArmor } from "../provider/use";

const AppContent = () => {
  const {
    actions: { setSelectedTimeInterval },
    state: { errorMessage, signedIn, siteTimes, userName, }
  } = usePromptArmor();

  return (
    <div>
      <h1>PromptArmor Family Webtime Tracking</h1>

      {errorMessage &&
        <div className="error-msgs">
          {errorMessage}
        </div>
      }

      {signedIn &&
        <>
          <div className="userName">Welcome back {userName}.</div>

          <div className="time-filters">
            <label>Filter by times</label>

            <select onChange={(ev) => setSelectedTimeInterval(ev.target.value)}>
              <option value="1">Past hour</option>
              <option value="24">Past day</option>
              <option value="168">Past week</option>
            </select>
          </div>

          <div className="stats">
            <div className="header">
              <span>Site</span>
              <span>Total Time (minutes / hours)</span>
            </div>

            {siteTimes && Object.entries(siteTimes).map((entry, i) => (
              <div key={i}>
                <span>{entry[0]}</span>
                <span>{Math.round(entry[1] / 1000 / 60)}m / {Math.round(entry[1] / 1000 / 60 / 60)}h </span>
              </div>
            ))}
          </div>
        </>
      }
    </div>
  );
};

export default AppContent;
