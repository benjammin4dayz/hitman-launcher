/* eslint-disable react-refresh/only-export-components */
import {
  spawnNeutralinoManagedProcess,
  spawnSelfManagedProcess,
} from '@/launch';
import launchReducer, {
  Action,
  DefaultState,
  initialState,
} from '@/launchReducer';
import { NeuDB } from '@/utils';
import * as Neutralino from '@neutralinojs/lib';
import path from 'path-browserify';
import type { FC, ReactNode } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

const LaunchContext = createContext<{
  state: DefaultState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const useLaunchContext = () => {
  const ctx = useContext(LaunchContext);
  if (!ctx) {
    throw new Error('useLaunchContext must be used within a LaunchProvider');
  }
  return ctx;
};

type ProcessRef = {
  exit: () => unknown;
};

export const LaunchProvider: FC<{
  children: ReactNode;
  onError?: (reason: string) => void;
}> = ({ children, onError }) => {
  const [state, dispatch] = useReducer(launchReducer, initialState);

  const gameRef = useRef<ProcessRef | null>(null);
  const serverRef = useRef<ProcessRef | null>(null);
  const patcherRef = useRef<ProcessRef | null>(null);

  useEffect(() => {
    void NeuDB.get().then(({ gamePath, peacockPath }) => {
      dispatch({
        type: 'SET_GAME_PATH',
        path: (gamePath as string) || '',
      });

      dispatch({
        type: 'SET_PEACOCK_PATH',
        path: (peacockPath as string) || '',
      });
    });
  }, []);

  useEffect(() => {
    const missingPath = state.gameLoading && !state.gamePath;
    const shouldStart = state.gameLoading && !gameRef.current;
    const shouldShutdown = !state.game && !state.gameLoading;

    if (missingPath) {
      onError?.('Missing game path');
      dispatch({ type: 'STOP_GAME' });

      return;
    }

    if (shouldStart) {
      if (state.gamePath.startsWith('steam://')) {
        void spawnSelfManagedProcess({
          name: 'HITMAN3.exe',
          launchTarget: state.gamePath,
          onStart: pid => {
            console.log('[ProcessWatcher] HITMAN3.exe started');
            dispatch({ type: 'GAME_STARTED' });
            gameRef.current = {
              exit: () => {
                if (!['string', 'number'].includes(typeof pid)) return;
                void Neutralino.os.spawnProcess(
                  `cmd /c taskkill /pid ${pid} /f /t`
                );
              },
            };
          },
          onEnd: () => {
            console.log('[ProcessWatcher] HITMAN3.exe shouldShutdown');
            dispatch({ type: 'STOP_GAME' });
          },
        });
      } else {
        void spawnNeutralinoManagedProcess({
          // IMPORTANT: load-bearing quotes below!
          path: `"${path.join(state.gamePath, 'Retail', 'HITMAN3.exe')}"`,
          name: 'game',
          onError,
          dispatch,
        }).then(ref => (gameRef.current = ref));
      }

      return;
    }

    if (shouldShutdown) {
      gameRef.current?.exit();
      gameRef.current = null;

      dispatch({ type: 'STOP_SERVER' });
      dispatch({ type: 'STOP_PATCHER' });

      return;
    }

    if (state.game) {
      dispatch({ type: 'GAME_STARTED' });
    }
  }, [state.game, state.gamePath, state.gameLoading, onError]);

  useEffect(() => {
    const missingPath = state.serverLoading && !state.peacockPath;
    const shouldStart = state.serverLoading && !serverRef.current;
    const shouldShutdown = !state.server && !state.serverLoading;

    if (missingPath) {
      onError?.('Missing server path');
      dispatch({ type: 'STOP_SERVER' });

      return;
    }

    if (shouldStart) {
      void spawnNeutralinoManagedProcess({
        // https://github.com/thepeacockproject/Peacock/blob/cd069f3f66a71b03d0431f8b225417f4838c7771/packaging/Start%20Server.cmd
        path: path.join(state.peacockPath, 'Start Server.cmd'),
        name: 'server',
        onError,
        dispatch,
      }).then(ref => (serverRef.current = ref));

      return;
    }

    if (shouldShutdown) {
      serverRef.current?.exit();
      serverRef.current = null;

      return;
    }

    if (state.server) {
      dispatch({ type: 'SERVER_STARTED' });
    }
  }, [state.server, state.serverLoading, state.peacockPath, onError]);

  useEffect(() => {
    const missingPath = state.patcherLoading && !state.peacockPath;
    const shouldStart = state.patcherLoading && !patcherRef.current;
    const shouldShutdown = !state.patcher && !state.patcherLoading;

    if (missingPath) {
      onError?.('Missing patcher path');
      dispatch({ type: 'STOP_PATCHER' });

      return;
    }

    if (shouldStart) {
      void spawnNeutralinoManagedProcess({
        // https://github.com/thepeacockproject/Peacock/blob/cd069f3f66a71b03d0431f8b225417f4838c7771/PeacockPatcher.exe
        path: path.join(state.peacockPath, 'PeacockPatcher.exe'),
        name: 'patcher',
        onError,
        dispatch,
      }).then(ref => (patcherRef.current = ref));

      return;
    }

    if (shouldShutdown) {
      patcherRef.current?.exit();
      patcherRef.current = null;

      return;
    }

    if (state.patcher) {
      dispatch({ type: 'PATCHER_STARTED' });
    }
  }, [state.patcher, state.patcherLoading, state.peacockPath, onError]);

  return (
    <LaunchContext.Provider value={{ state, dispatch }}>
      {children}
    </LaunchContext.Provider>
  );
};

export default LaunchProvider;
