import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Root from './App';
import './style/index.css';
import { DarkModeProvider } from "./context/DarkModeContext.tsx";
import GoogleProvider from './Google0AuthProvider.tsx';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DarkModeProvider>
      <GoogleProvider>
        <Root />
      </GoogleProvider>
    </DarkModeProvider>
  </StrictMode>
);
