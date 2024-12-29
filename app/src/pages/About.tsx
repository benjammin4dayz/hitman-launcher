import { BrandHeading } from '@/components/BrandHeading';
import { RouteButton } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { spawn } from '@/utils';
import {
  Code,
  Flex,
  HStack,
  IconButton,
  Separator,
  Text,
} from '@chakra-ui/react';
import {
  LuArrowLeftFromLine,
  LuBug,
  LuDownload,
  LuGithub,
} from 'react-icons/lu';

import { IOILogoIcon } from '@/components/IOILogoIcon';

export default function About() {
  const openExternalLink = (url: string) => {
    void spawn({
      processName: 'External Link: ' + url,
      processPath: `cmd /c start ${url}`,
    });
  };

  return (
    <Flex direction="column" flex="1" p="30px">
      <BrandHeading mb="0.3em">ABOUT</BrandHeading>

      <HStack>
        <Tooltip content="Go back">
          <RouteButton variant="ghost" to="/">
            <LuArrowLeftFromLine />
          </RouteButton>
        </Tooltip>

        <Tooltip content="View source on GitHub">
          <IconButton
            variant="ghost"
            onClick={() => {
              openExternalLink(
                'https://github.com/benjammin4dayz/hitman-launcher'
              );
            }}
          >
            <LuGithub />
          </IconButton>
        </Tooltip>

        <Tooltip content="View releases on GitHub">
          <IconButton
            variant="ghost"
            onClick={() => {
              openExternalLink(
                'https://github.com/benjammin4dayz/hitman-launcher/releases'
              );
            }}
          >
            <LuDownload />
          </IconButton>
        </Tooltip>

        <Tooltip content="Report a bug">
          <IconButton
            variant="ghost"
            onClick={() => {
              openExternalLink(
                'https://github.com/benjammin4dayz/hitman-launcher/issues/new'
              );
            }}
          >
            <LuBug />
          </IconButton>
        </Tooltip>

        <Tooltip content="Visit IO Interactive's website">
          <IconButton
            variant="ghost"
            onClick={() => openExternalLink('https://www.ioi.dk/')}
          >
            <IOILogoIcon />
          </IconButton>
        </Tooltip>
      </HStack>

      <Separator mb="1em" />

      <Flex direction="column" flex="1" gap="8px" mb="1em">
        Created By <Code userSelect="text">benjammin4dayz</Code>
        Version Info
        <Code userSelect="all">
          app: {window.NL_APPVERSION} | client: {window.NL_CVERSION} | server:{' '}
          {window.NL_VERSION}
        </Code>
      </Flex>

      <Separator mt="1em" />

      <Text
        fontStyle="italic"
        fontSize="sm"
        color={{ _dark: 'gray.400', _light: 'gray.600' }}
      >
        {/* Borrowed wording from HITMAPS because it sounds professional :) */}
        HITMAN™ is a trademark exclusively licensed to IO Interactive.
      </Text>
    </Flex>
  );
}
