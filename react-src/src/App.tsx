import bgImageSrc from '@/assets/worldmap_grey.png';
import { useNeutralinoContext } from '@/NeutralinoProvider';
import { Box, Flex, Heading, Separator } from '@chakra-ui/react';
import { LuDoorOpen, LuPlay, LuSettings } from 'react-icons/lu';
import { AppBar } from './components/AppBar';
import { Button } from './components/ui/button';

function App() {
  const { exit } = useNeutralinoContext();

  return (
    <Flex
      direction="column"
      h="100vh"
      maxH="100vh"
      overflow="hidden"
      bg={`url('${bgImageSrc}')`}
      userSelect="none"
    >
      <AppBar />
      <Flex direction="column" flex="1" p="30px">
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
          >
            <LuPlay /> Play
          </Button>

          <Box flex="1" />
          <Separator
            borderColor="lotion"
            size="md"
            justifyContent="flex-start"
          />

          <Button
            size="xl"
            w="full"
            variant="surface"
            justifyContent="flex-start"
          >
            <LuSettings /> Settings
          </Button>
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
    </Flex>
  );
}

export default App;
