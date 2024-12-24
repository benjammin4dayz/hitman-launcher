/* eslint-disable react-refresh/only-export-components */
import type { FC, ReactNode } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { NeuDB, spawn } from './utils';
import path from 'path-browserify';

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
    // TODO: implement process watcher here; this involves checking the path
    // for steam:// browser protocol before using the regular spawn command.
    if (state.game && !state.gamePath) {
      onError?.('Missing game path');
      dispatch({ type: 'STOP_GAME' });
      return;
    } else if (state.game) {
      void spawn({
        processPath: state.gamePath,
        onStdErr: () => {
          onError?.('Game failed to launch');
          dispatch({ type: 'STOP_GAME' });
        },
        onExit: () => dispatch({ type: 'STOP_GAME' }),
      }).then(ref => (gameRef.current = ref));
    } else {
      gameRef.current?.exit();
      gameRef.current = null;
    }
  }, [state.game, state.gamePath, onError]);

  useEffect(() => {
    if (state.server && !state.peacockPath) {
      onError?.('Missing server path');
      dispatch({ type: 'STOP_SERVER' });
      return;
    } else if (state.server) {
      void spawn({
        // https://github.com/thepeacockproject/Peacock/blob/cd069f3f66a71b03d0431f8b225417f4838c7771/packaging/Start%20Server.cmd
        processPath: path.join(state.peacockPath, 'Start Server.cmd'),
        onStdErr: () => {
          onError?.('Server failed to launch');
          dispatch({ type: 'STOP_SERVER' });
        },
        onExit: () => dispatch({ type: 'STOP_SERVER' }),
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
    } else if (state.patcher) {
      void spawn({
        // https://github.com/thepeacockproject/Peacock/blob/cd069f3f66a71b03d0431f8b225417f4838c7771/PeacockPatcher.exe
        processPath: path.join(state.peacockPath, 'PeacockPatcher.exe'),
        onStdErr: () => {
          onError?.('Patcher failed to launch');
          dispatch({ type: 'STOP_PATCHER' });
        },
        onExit: () => dispatch({ type: 'STOP_PATCHER' }),
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
