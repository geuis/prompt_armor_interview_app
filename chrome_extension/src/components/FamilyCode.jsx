import React from 'react';
import { useState } from 'react';
import { usePromptArmor } from "../provider/use";

const FamilyCode = () => {
  const {
    actions: { createFamily, getFamilyByCode },
  } = usePromptArmor();
  const [familyCodeInput, setFamilyCodeInput] = useState('');

  return (
    <section className="family-code-section">
      <div>
        Enter your famiily code, or create a new one.
      </div>

      <div>
        <label htmlFor="family-code">Family Code</label>
        <input key="family-code-key" type="text" id="family-code" name="family-code" onChange={(ev) => setFamilyCodeInput(ev.target.value)} />

        <button disabled={!familyCodeInput} onClick={() => getFamilyByCode(familyCodeInput)}>Submit</button>
      </div>

      <div>
        <label>Create a new family:</label>

        <button onClick={() => createFamily()}>Create</button>
      </div>
    </section>
  );
};

export default FamilyCode;
