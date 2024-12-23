import { useNeutralinoContext } from '@/NeutralinoProvider';
import { Box, Heading, VStack } from '@chakra-ui/react';
import { Button } from './components/ui/button';

function App() {
  const { exit } = useNeutralinoContext();

  return (
    <Box h="100vh" display="flex" justifyContent="center" alignItems="center">
      <VStack>
        <Heading as="h1">Hitman Launcher</Heading>
        <Button onClick={exit}>Exit</Button>
      </VStack>
    </Box>
  );
}

export default App;
