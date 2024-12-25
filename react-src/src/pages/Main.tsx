import bgImageSrc from '@/assets/worldmap_grey.jpg';
import { BrandHeading } from '@/components/BrandHeading';
import { Button, RouteButton } from '@/components/ui/button';
import { Status } from '@/components/ui/status';
import { Tooltip } from '@/components/ui/tooltip';
import { useLaunchContext } from '@/LaunchProvider';
import { createWindowAtCursor } from '@/utils';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Separator,
  Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuInfo, LuMap, LuPower, LuPowerOff, LuSettings } from 'react-icons/lu';

export default function Main() {
  const { state, dispatch } = useLaunchContext();

  const [buttonsTooltipContent, setButtonsTooltipContent] = useState({
    game: '',
    server: '',
    patcher: '',
  });

  const play = () => {
    dispatch({ type: 'START_GAME' });
    dispatch({ type: 'START_SERVER' });
    dispatch({ type: 'START_PATCHER' });
  };

  const stop = () => {
    dispatch({ type: 'SHUTDOWN' });
  };

  useEffect(() => {
    if (!state.gamePath) {
      setButtonsTooltipContent(prev => ({
        ...prev,
        game: 'You must set the game path first',
      }));
    } else if (state.game) {
      setButtonsTooltipContent(prev => ({
        ...prev,
        game: 'Take them all down',
      }));
    } else if (!state.game) {
      setButtonsTooltipContent(prev => ({
        ...prev,
        game: 'Good Evening, 47',
      }));
    }
  }, [state.game, state.gamePath]);

  useEffect(() => {
    if (!state.peacockPath) {
      setButtonsTooltipContent(prev => ({
        ...prev,
        server: 'You must set the Peacock path to use this feature',
      }));
    } else if (state.server) {
      setButtonsTooltipContent(prev => ({
        ...prev,
        server: 'Stop Peacock server',
      }));
    } else if (!state.server) {
      setButtonsTooltipContent(prev => ({
        ...prev,
        server: 'Start Peacock server',
      }));
    }
  }, [state.server, state.peacockPath]);

  useEffect(() => {
    if (!state.peacockPath) {
      setButtonsTooltipContent(prev => ({
        ...prev,
        patcher: 'You must set the Peacock path to use this feature',
      }));
    } else if (state.patcher) {
      setButtonsTooltipContent(prev => ({
        ...prev,
        patcher: 'Stop Peacock patcher',
      }));
    } else if (!state.patcher) {
      setButtonsTooltipContent(prev => ({
        ...prev,
        patcher: 'Start Peacock patcher',
      }));
    }
  }, [state.patcher, state.peacockPath]);

  return (
    <Flex bg={`url('${bgImageSrc}')`} direction="column" flex="1" p="30px">
      <BrandHeading>HITMAN</BrandHeading>

      <Flex direction="column" gap="12px" flex="1">
        <Tooltip content={buttonsTooltipContent.game}>
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
                {state.gameLoading ? <Spinner /> : <LuPower />}
                Launch
              </>
            ) : (
              <>
                <LuPowerOff /> Stop
              </>
            )}
          </Button>
        </Tooltip>

        <Flex gap="12px" justifyContent="center">
          <Tooltip content={buttonsTooltipContent.server}>
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
          </Tooltip>

          <Tooltip content={buttonsTooltipContent.patcher}>
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
          </Tooltip>
        </Flex>

        <Box flex="1" />

        <Separator borderColor="lotion" size="md" justifyContent="flex-start" />

        <HStack gap="12px" justifyContent="space-between">
          <Tooltip content="View app info">
            <RouteButton
              iconButton
              variant="surface"
              justifyContent="center"
              to="/about"
            >
              <LuInfo />
            </RouteButton>
          </Tooltip>

          <Tooltip content="Open HITMAPS">
            <IconButton
              flex="1"
              variant="surface"
              onClick={() => {
                void createWindowAtCursor('https://hitmaps.com', {
                  width: 800,
                  height: 725,
                  title: 'HITMAPS - Interactive Maps for the Hitman Series',
                });
              }}
            >
              <LuMap />
            </IconButton>
          </Tooltip>

          <Tooltip content="Configure app settings">
            <RouteButton
              iconButton
              variant="surface"
              justifyContent="center"
              to="/settings"
            >
              <LuSettings />
            </RouteButton>
          </Tooltip>
        </HStack>
      </Flex>
    </Flex>
  );
}
