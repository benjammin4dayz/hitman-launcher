/* eslint-disable react-refresh/only-export-components */
import * as Neutralino from '@neutralinojs/lib';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

type NeutralinoContextProps = {
  exit: () => unknown;
  ready: boolean;
} | null;

type NeutralinoProviderProps = {
  children: ReactNode;
  /** Time in milliseconds before switching from loader to fallback. */
  failAfterMs?: number;
  /** Element to display when Neutralino fails to initialize. */
  fallback?: ReactNode;
  /** Element to display while Neutralino is initializing. */
  loader?: ReactNode;
  /** Irrespectively render children, allowing for manual state management. */
  unmanaged?: boolean;
};

const NeutralinoContext = createContext<NeutralinoContextProps>(null);

export const useNeutralinoContext = () => {
  const ctx = useContext(NeutralinoContext);
  if (!ctx) {
    throw new Error(
      'useNeutralinoContext must be used within a NeutralinoProvider'
    );
  }
  return ctx;
};

export const NeutralinoProvider = ({
  children,
  failAfterMs = 3000,
  fallback,
  loader,
  unmanaged,
}: NeutralinoProviderProps) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  const errorTimeout = useRef<number | null>(null);

  const exit = () => {
    void Neutralino.app.exit();
  };

  useEffect(() => {
    try {
      Neutralino.init();
      //
      // If the state is reloaded while Neutralino is already initialized,
      // the "ready" event won't fire. This should always be accurate because
      // Neutralino's init function either passes or throws an error.
      //
      setReady(true);
    } catch (e) {
      errorTimeout.current = setTimeout(() => {
        setError(true);
        errorTimeout.current = null;
      }, failAfterMs);
      console.warn('Neutralino failed to initialize', e);
    }

    return () => {
      if (errorTimeout.current) {
        clearTimeout(errorTimeout.current);
        errorTimeout.current = null;
      }
    };
  }, [failAfterMs]);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      // Don't center in dev because it gets triggered by HMR
      void Neutralino.window.center();
    }
    void Neutralino.window.show();
  }, [ready]);

  return (
    <NeutralinoContext.Provider value={{ ready, exit }}>
      {unmanaged
        ? children
        : ready
        ? children
        : error
        ? fallback || (
            <button onClick={() => window.location.reload()}>
              Fatal Error! Click to reload.
            </button>
          )
        : loader || <p>Loading...</p>}
    </NeutralinoContext.Provider>
  );
};

export default NeutralinoProvider;
