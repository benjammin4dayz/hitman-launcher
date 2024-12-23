import App from '@/App';
import NeutralinoProvider from '@/NeutralinoProvider';
import { Provider as ChakraProvider } from '@/components/ui/provider';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NeutralinoProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </NeutralinoProvider>
  </React.StrictMode>
);
