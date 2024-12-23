import { Box, Text } from '@chakra-ui/react';

export function AppBar() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      p="1rem"
      bg="phillippineRed"
      w="100vw"
    >
      <Text>App Bar</Text>
    </Box>
  );
}
