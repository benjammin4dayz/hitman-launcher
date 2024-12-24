import App from '@/App';
import LaunchProvider from '@/LaunchProvider';
import NeutralinoProvider from '@/NeutralinoProvider';
import { Provider as ChakraProvider } from '@/components/ui/provider';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster, toaster } from './components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NeutralinoProvider>
      <LaunchProvider
        onError={reason =>
          toaster.error({
            duration: 1500,
            type: 'error',
            description: reason,
            meta: { closable: true },
          })
        }
      >
        <ChakraProvider>
          <App />
          <Toaster />
        </ChakraProvider>
      </LaunchProvider>
    </NeutralinoProvider>
  </React.StrictMode>
);
