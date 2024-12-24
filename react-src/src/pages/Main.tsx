import bgImageSrc from '@/assets/worldmap_grey.jpg';
import { Button, RouteButton } from '@/components/ui/button';
import { useLaunchContext } from '@/LaunchProvider';
import { useNeutralinoContext } from '@/NeutralinoProvider';
import { Box, Flex, Heading, Separator } from '@chakra-ui/react';
import { LuDoorOpen, LuPlay, LuSettings } from 'react-icons/lu';

export default function Main() {
  const { exit } = useNeutralinoContext();
  const { dispatch } = useLaunchContext();

  const play = () => {
    dispatch({ type: 'START_GAME' });
    dispatch({ type: 'START_SERVER' });
    dispatch({ type: 'START_PATCHER' });
  };

  return (
    <Flex bg={`url('${bgImageSrc}')`} direction="column" flex="1" p="30px">
      <Heading
        as="h1"
        bg="lotion"
        border="1px solid"
        borderColor="lotion"
        color="black"
        fontFamily="heading"
        fontWeight="bold"
        fontSize="5xl"
        letterSpacing="0.266em"
        m="auto"
        mb="1em"
        px="6"
        py="2"
        textAlign="center"
        whiteSpace="nowrap"
      >
        HITMAN
      </Heading>
      <Flex direction="column" gap="12px" flex="1">
        <Button
          size="2xl"
          w="full"
          variant="surface"
          justifyContent="flex-start"
          onClick={play}
        >
          <LuPlay /> Play
        </Button>

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
