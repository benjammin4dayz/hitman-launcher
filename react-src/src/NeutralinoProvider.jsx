/* eslint-disable react-refresh/only-export-components */
import * as Neutralino from '@neutralinojs/lib';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';

const NeutralinoContext = createContext(null);

export const useNeutralinoContext = () => {
  const ctx = useContext(NeutralinoContext);
  if (!ctx) {
    throw new Error(
      'useNeutralinoContext must be used within a NeutralinoProvider'
    );
  }
  return ctx;
};

export const NeutralinoProvider = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [dragHandle, setDragHandle] = useState(null);

  useEffect(() => {
    try {
      Neutralino.init();
      Neutralino.window.center();
    } catch (e) {
      console.warn('Neutralino failed to initialize', e);
    }

    const onReady = () => setReady(true);
    Neutralino.events.on('ready', onReady);
    Neutralino.events.on('windowClose', shutdown);

    return () => {
      Neutralino.events.off('ready', onReady);
      Neutralino.events.off('windowClose', shutdown);
    };
  }, []);

  useEffect(() => {
    if (ready && dragHandle instanceof HTMLElement) {
      void Neutralino.window.setDraggableRegion(dragHandle, {
        alwaysCapture: true,
        dragMinDistance: 10,
      });

      return () => {
        void Neutralino.window.unsetDraggableRegion(dragHandle);
      };
    }
  }, [ready, dragHandle]);

  const createWindowAtCursor = async (url, options) => {
    const { x, y } = await Neutralino.window.getPosition();

    return Neutralino.window.create(url, {
      x,
      y,
      borderless: false,
      enableInspector: import.meta.env.DEV ? true : false,
      exitProcessOnClose: true,
      resizable: true,
      transparent: false,
      ...options,
    });
  };

  return (
    <NeutralinoContext.Provider
      value={{
        createWindowAtCursor,
        shutdown,
        minimize: Neutralino.window.minimize,
        ready,
        setDragHandle,
      }}
    >
      {ready ? (
        children
      ) : (
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            width: '100vw',
            height: '100vh',
          }}
          onClick={() => window.location.reload()}
        >
          Loading...
        </div>
      )}
    </NeutralinoContext.Provider>
  );
};

export default NeutralinoProvider;

NeutralinoProvider.propTypes = {
  children: PropTypes.node,
  dragHandleElement: PropTypes.instanceOf(HTMLElement),
};

async function shutdown(cb = async () => {}) {
  try {
    await cb();
  } catch {
    // ignore
  }

  setTimeout(Neutralino.app.exit, Math.random() * 90 + 10);
}
