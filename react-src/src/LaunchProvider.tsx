/* eslint-disable react-refresh/only-export-components */
import { NeuDB, ProcessWatcher, spawn } from '@/utils';
import * as Neutralino from '@neutralinojs/lib';
import path from 'path-browserify';
import type { Dispatch, FC, ReactNode } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

type DefaultState = {
  gamePath: string;
  peacockPath: string;
  game: boolean;
  server: boolean;
  patcher: boolean;
};

const initialState: DefaultState = {
  gamePath: '',
  peacockPath: '',
  game: false,
  server: false,
  patcher: false,
};

type Action =
  | { type: 'START_GAME' }
  | { type: 'STOP_GAME' }
  | { type: 'SET_GAME_PATH'; path: string }
  | { type: 'START_SERVER' }
  | { type: 'STOP_SERVER' }
  | { type: 'START_PATCHER' }
  | { type: 'STOP_PATCHER' }
  | { type: 'SET_PEACOCK_PATH'; path: string }
  | { type: 'SHUTDOWN' };

const reducer = (state: DefaultState, action: Action): DefaultState => {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, game: true };
    case 'STOP_GAME':
      return { ...state, game: false };
    case 'START_SERVER':
      return { ...state, server: true };
    case 'STOP_SERVER':
      return { ...state, server: false };
    case 'START_PATCHER':
      return { ...state, patcher: true };
    case 'STOP_PATCHER':
      return { ...state, patcher: false };
    case 'SET_GAME_PATH':
      return { ...state, gamePath: action.path };
    case 'SET_PEACOCK_PATH':
      return { ...state, peacockPath: action.path };
    case 'SHUTDOWN':
      return { ...state, game: false, server: false, patcher: false };
    default:
      return state;
  }
};

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
  const [state, dispatch] = useReducer(reducer, initialState);
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
    if (state.game && !state.gamePath) {
      onError?.('Missing game path');
      dispatch({ type: 'STOP_GAME' });
      return;
    } else if (state.game && !gameRef.current) {
      if (state.gamePath.startsWith('steam://')) {
        void spawnSelfManagedProcess({
          name: 'HITMAN3.exe',
          launchTarget: state.gamePath,
          onStart: pid => {
            console.log('[ProcessWatcher] HITMAN3.exe started');
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
            console.log('[ProcessWatcher] HITMAN3.exe stopped');
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
    } else {
      gameRef.current?.exit();
      gameRef.current = null;

      dispatch({ type: 'STOP_SERVER' });
      dispatch({ type: 'STOP_PATCHER' });
    }
  }, [state.game, state.gamePath, onError]);

  useEffect(() => {
    if (state.server && !state.peacockPath) {
      onError?.('Missing server path');
      dispatch({ type: 'STOP_SERVER' });
      return;
    } else if (state.server && !serverRef.current) {
      void spawnNeutralinoManagedProcess({
        // https://github.com/thepeacockproject/Peacock/blob/cd069f3f66a71b03d0431f8b225417f4838c7771/packaging/Start%20Server.cmd
        path: path.join(state.peacockPath, 'Start Server.cmd'),
        name: 'server',
        onError,
        dispatch,
      }).then(ref => (serverRef.current = ref));
    } else {
      serverRef.current?.exit();
      serverRef.current = null;
    }
  }, [state.server, state.peacockPath, onError]);

  useEffect(() => {
    if (state.patcher && !state.peacockPath) {
      onError?.('Missing patcher path');
      dispatch({ type: 'STOP_PATCHER' });
      return;
    } else if (state.patcher && !patcherRef.current) {
      void spawnNeutralinoManagedProcess({
        // https://github.com/thepeacockproject/Peacock/blob/cd069f3f66a71b03d0431f8b225417f4838c7771/PeacockPatcher.exe
        path: path.join(state.peacockPath, 'PeacockPatcher.exe'),
        name: 'patcher',
        onError,
        dispatch,
      }).then(ref => (patcherRef.current = ref));
    } else {
      patcherRef.current?.exit();
      patcherRef.current = null;
    }
  }, [state.patcher, state.peacockPath, onError]);

  return (
    <LaunchContext.Provider value={{ state, dispatch }}>
      {children}
    </LaunchContext.Provider>
  );
};

export default LaunchProvider;

async function spawnNeutralinoManagedProcess({
  name,
  path,
  dispatch,
  onError,
  onExit,
}: {
  name: string;
  path: string;
  dispatch: Dispatch<Action>;
  onError?: (error: string) => void;
  onExit?: () => void;
}) {
  const dispatchStopAction = () => {
    //@ts-expect-error handled by default case
    dispatch({ type: `STOP_${name.toUpperCase()}` });
  };

  const ref = await spawn({
    processPath: path,
    processName: name,
    onStdErr: evt => {
      if (typeof evt !== 'string') {
        console.warn(
          'Unexpected response from process! Expected string but received type:',
          typeof evt
        );
        return;
      }
      if (evt.includes('is not recognized as an internal or external')) {
        onError?.(
          `${name.charAt(0).toUpperCase() + name.slice(1)} failed to launch`
        );
        dispatchStopAction();
      } else if (evt.includes('The system cannot find the')) {
        onError?.(`Invalid ${name} path`);
        dispatchStopAction();
      }
    },
    onExit: () => {
      onExit?.();
      dispatchStopAction();
    },
  });

  return ref;
}

function spawnSelfManagedProcess({
  name,
  launchTarget,
  onStart,
  onEnd,
}: {
  name: string;
  launchTarget: string;
  onStart?: (pid: string | number) => void;
  onEnd?: () => void;
}) {
  console.log(`[ProcessWatcher] Spawning ${name} with ${launchTarget}...`);
  const watcher = new ProcessWatcher({
    processName: name,
    onProcessStart: pid => {
      onStart?.(pid);
    },
    onProcessEnd: () => {
      onEnd?.();
      watcher.stopWatcher();
    },
  });
  watcher.startWatcher(1000);
  void Neutralino.os.spawnProcess(`cmd /c start ${launchTarget}`);
}
