import App from '@/App';
import { Provider as ChakraProvider } from '@/components/ui/provider';
import { Toaster, toaster } from '@/components/ui/toaster';
import LaunchProvider from '@/providers/LaunchProvider';
import NeutralinoProvider from '@/providers/NeutralinoProvider';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NeutralinoProvider unmanaged>
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
