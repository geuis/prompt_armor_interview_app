import './css/popup.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { PromptArmorProvider } from './provider/provider';
import AppContent from './components/AppContent';

const App = () => {
  return (
    <PromptArmorProvider>
      <AppContent />
    </PromptArmorProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
