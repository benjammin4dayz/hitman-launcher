import bgImageSrc from '@/assets/worldmap_grey.jpg';
import { BrandHeading } from '@/components/BrandHeading';
import { Button, RouteButton } from '@/components/ui/button';
import { Status } from '@/components/ui/status';
import { useLaunchContext } from '@/LaunchProvider';
import { useNeutralinoContext } from '@/NeutralinoProvider';
import { Box, Flex, Separator, Spinner } from '@chakra-ui/react';
import { LuDoorOpen, LuPlay, LuPowerOff, LuSettings } from 'react-icons/lu';

export default function Main() {
  const { exit: _exit } = useNeutralinoContext();
  const { state, dispatch } = useLaunchContext();

  const play = () => {
    dispatch({ type: 'START_GAME' });
    dispatch({ type: 'START_SERVER' });
    dispatch({ type: 'START_PATCHER' });
  };

  const stop = () => {
    dispatch({ type: 'SHUTDOWN' });
  };

  const exit = () => {
    stop();
    setTimeout(() => {
      _exit();
    }, Math.random() * 65 + 10); // Allow time for processes to stop
  };

  return (
    <Flex bg={`url('${bgImageSrc}')`} direction="column" flex="1" p="30px">
      <BrandHeading>HITMAN</BrandHeading>
      <Flex direction="column" gap="12px" flex="1">
        <Button
          size="2xl"
          w="full"
          variant="surface"
          justifyContent="flex-start"
          disabled={!state.gamePath}
          onClick={state.game ? stop : play}
        >
          {!state.game ? (
            <>
              {state.gameLoading ? <Spinner /> : <LuPlay />}
              Play
            </>
          ) : (
            <>
              <LuPowerOff /> Stop
            </>
          )}
        </Button>
        <Flex gap="12px" justifyContent="center">
          <Button
            flex="1"
            variant="surface"
            disabled={!state.peacockPath}
            onClick={() => {
              if (state.server) {
                dispatch({ type: 'STOP_SERVER' });
              } else {
                dispatch({ type: 'START_SERVER' });
              }
            }}
          >
            {state.serverLoading ? (
              <Spinner />
            ) : (
              <Status value={state.server ? 'success' : 'error'} />
            )}
            Server
          </Button>
          <Button
            flex="1"
            variant="surface"
            disabled={!state.peacockPath}
            onClick={() => {
              if (state.patcher) {
                dispatch({ type: 'STOP_PATCHER' });
              } else {
                dispatch({ type: 'START_PATCHER' });
              }
            }}
          >
            <Status value={state.patcher ? 'success' : 'error'} />
            Patcher
          </Button>
        </Flex>
        <Box flex="1" />
        <Separator borderColor="lotion" size="md" justifyContent="flex-start" />
        <RouteButton
          size="xl"
          w="full"
          variant="surface"
          justifyContent="flex-start"
          to="/settings"
        >
          <LuSettings /> Settings
        </RouteButton>
        <Button
          size="xl"
          w="full"
          variant="surface"
          justifyContent="flex-start"
          onClick={exit}
        >
          <LuDoorOpen />
          Quit
        </Button>
      </Flex>
    </Flex>
  );
}
