/* eslint-disable react-refresh/only-export-components */
import path from 'path-browserify';
import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  BACKGROUNDS,
  GAME_EXECUTABLE,
  PATCHER_EXECUTABLE,
  SERVER_EXECUTABLE,
} from './constants';
import { useNeutralinoContext } from './NeutralinoProvider';
import { spawn as _spawn } from './utils/neu';
import { NeuDB } from './utils/NeuDB';
import { ProcessWatcher } from './utils/ProcessWatcher';

const AppContext = createContext(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
};

export const AppProvider = ({ children }) => {
  const { shutdown: _shutdown } = useNeutralinoContext();

  const [background, setBackground] = useState(BACKGROUNDS[0]);

  const [gamePath, setGamePath] = useState('');
  const saveGamePath = () => NeuDB.setKey('gamePath', gamePath);

  const [game, setGame] = useState(null);
  const startGame = useCallback(() => {
    if (gamePath.startsWith('steam')) {
      return new Promise(resolve => {
        const procWatcher = new ProcessWatcher(path.basename(GAME_EXECUTABLE), {
          onProcStart: pid => {
            setGame({
              // When spawning a process through an intermediate, like Steam,
              // we don't have a direct handle to the process. In order to
              // preserve the ability to exit the process, we need to return a
              // platform-specific command that kills a target PID
              exit: () => {
                return _spawn(`cmd /c taskkill /pid ${pid} /f /t`);
              },
            });
            resolve();
          },
          onProcEnd: () => {
            setGame(null);
            procWatcher.stopWatcher();
          },
        });

        procWatcher.startWatcher(3000);

        _spawn(`cmd /c start ${gamePath.trim()}`);
      });
    }
    return spawn(gamePath, GAME_EXECUTABLE, setGame);
  }, [gamePath]);
  const stopGame = useCallback(async () => {
    if (game) {
      await game.exit();
      setGame(null);
    }
  }, [game]);

  const [peacockPath, setPeacockPath] = useState('');
  const savePeacockPath = () => NeuDB.setKey('peacockPath', peacockPath);

  const [patcher, setPatcher] = useState(null);
  const startPatcher = useCallback(() => {
    return peacockPath
      ? spawn(peacockPath, PATCHER_EXECUTABLE, setPatcher)
      : null;
  }, [peacockPath, setPatcher]);
  const stopPatcher = useCallback(async () => {
    if (patcher) {
      await patcher.exit();
      setPatcher(null);
    }
  }, [patcher]);

  const [server, setServer] = useState(null);
  const startServer = useCallback(() => {
    return peacockPath
      ? spawn(peacockPath, SERVER_EXECUTABLE, setServer)
      : null;
  }, [peacockPath, setServer]);
  const stopServer = useCallback(async () => {
    if (server) {
      await server.exit();
      setServer(null);
    }
  }, [server]);

  const shutdown = useCallback(
    () =>
      _shutdown(async () => {
        await stopPatcher();
        await stopServer();
        await stopGame();
      }),
    [_shutdown, stopPatcher, stopServer, stopGame]
  );

  useEffect(() => {
    (async () => {
      const cfg = await NeuDB.get();
      setBackground(cfg?.background || BACKGROUNDS[0]);
      setGamePath(cfg?.gamePath || '');
      setPeacockPath(cfg?.peacockPath || '');
    })();
  }, []);

  return (
    <AppContext.Provider
      value={{
        background,
        setBackground,
        gamePath,
        setGamePath,
        saveGamePath,
        peacockPath,
        setPeacockPath,
        savePeacockPath,
        patcher,
        startPatcher,
        stopPatcher,
        server,
        startServer,
        stopServer,
        game,
        startGame,
        stopGame,
        shutdown,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

AppProvider.propTypes = {
  children: PropTypes.node,
};

async function spawn(dirname, executable, setState) {
  const proc = await _spawn(path.join(dirname, executable), {
    onBeforeClose: () => setState(null),
  });
  setState(proc);
}