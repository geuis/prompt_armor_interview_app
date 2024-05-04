import { useContext } from 'react';
import { PromptArmorContext } from './context';

const usePromptArmor = () => useContext(PromptArmorContext);

export {
  usePromptArmor
}; 
