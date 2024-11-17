import PropTypes from 'prop-types';
import { Box } from '../atoms/Box';

export const StatusDisplay = ({ patcher, server, game, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} {...props}>
      <Box
        outlineColor="white"
        slotL={`PATCHER`}
        slotR={<>{patcher ? '✅' : '❌'}</>}
      />
      <Box outlineColor="white" slotL={`SERVER`} slotR={server ? '✅' : '❌'} />
      <Box outlineColor="white" slotL={`HITMAN`} slotR={game ? '✅' : '❌'} />
    </div>
  );
};

StatusDisplay.propTypes = {
  patcher: PropTypes.oneOfType([() => null, PropTypes.object]),
  server: PropTypes.oneOfType([() => null, PropTypes.object]),
  game: PropTypes.oneOfType([() => null, PropTypes.object]),
};
