import { Outlet } from 'react-router-dom';
import { AppBar } from '@/components/AppBar';
import { Flex } from '@chakra-ui/react';

export default function RootLayout() {
  return (
    <Flex direction="column" h="100vh" overflow="hidden" userSelect="none">
      <AppBar />
      <Outlet />
    </Flex>
  );
}
