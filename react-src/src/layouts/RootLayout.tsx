import { Outlet } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';

// See the links below for guidance to create an animated outlet
// https://stackoverflow.com/a/78272762
// https://codesandbox.io/p/sandbox/transition-hook-examples-o3f41?file=%2Fsrc%2Fdemos%2FRouteTransition.jsx

export default function RootLayout() {
  return (
    <Flex direction="column" h="100vh" overflow="hidden" userSelect="none">
      <Outlet />
    </Flex>
  );
}
