import React from 'react';
import { useState } from 'react';
import { usePromptArmor } from "../provider/use";

const Members = () => {
  const {
    actions: { newMember, updateUser },
    state: { members, familyCode }
  } = usePromptArmor();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newUserName, setNewUserName] = useState();

  return (
    <section className="members-section">
      <div>
        Your family code: {familyCode}
      </div>
      <div>
        Choose a member of the family to sign in as, or add yourself.
      </div>

      <div>
        <select onChange={(ev) => ev.target.value !== -1 && setSelectedUserId(ev.target.value)}>
          {!selectedUserId && <option value={-1}>Pick a user</option>}

          {members.map((item, i) => (
            <option key={i} value={item.id}>{item.name}</option>
          ))}
        </select>

        <button disabled={!selectedUserId} onClick={() => updateUser(selectedUserId, members.find((m) => m.id === selectedUserId).name)}>
          Choose
        </button>
      </div>

      <div>
        <label htmlFor="new-member">New member</label>
        <input key="new-member-key" type="text" id="new-member" name="new-member" onChange={(ev) => setNewUserName(ev.target.value)} />

        <button disabled={!newUserName} onClick={() => newMember(familyCode, newUserName)}>Submit</button>
      </div>
    </section>
  );
};

export default Members;
