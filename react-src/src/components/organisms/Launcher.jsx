import PropTypes from 'prop-types';
import { useAppContext } from '../../AppProvider';

export const Launcher = ({ style }) => {
  const {
    patcher,
    server,
    game,
    startPatcher,
    startServer,
    startGame,
    stopPatcher,
    stopServer,
    stopGame,
  } = useAppContext();

  const launch = async () => {
    !patcher && (await startPatcher());
    !server && (await startServer());
    !game && (await startGame());
  };

  const quit = async () => {
    patcher && (await stopPatcher());
    server && (await stopServer());
    game && (await stopGame());
  };

  return (
    <button style={style} onClick={patcher || server || game ? quit : launch}>
      {patcher || server || game ? 'Quit' : 'Launch'}
    </button>
  );
};

Launcher.propTypes = {
  style: PropTypes.object,
};
