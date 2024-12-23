import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import NeutralinoProvider from '@/NeutralinoProvider';
import { Provider as ChakraProvider } from '@/components/ui/provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NeutralinoProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </NeutralinoProvider>
  </React.StrictMode>
);
