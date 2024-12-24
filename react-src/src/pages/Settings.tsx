import worldmapRed from '@/assets/worldmap_red.png';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import { useLaunchContext } from '@/LaunchProvider';
import { NeuDB, userSelectFolderPath } from '@/utils';
import {
  Box,
  createListCollection,
  Fieldset,
  Heading,
  HStack,
  Input,
} from '@chakra-ui/react';
import { LuFileSearch2 } from 'react-icons/lu';
import { ActionFunction, Form, redirect } from 'react-router-dom';

const launchCommands = createListCollection({
  items: [
    {
      label: 'HITMAN: World of Assassination (Steam)',
      value: 'steam://launch/1659040',
    },
    {
      label: 'HITMAN: Free Starter Pack (Steam)',
      value: 'steam://launch/1847520',
    },
    {
      label: 'Custom Path',
      value: '',
    },
  ],
});

export default function Settings() {
  const { state, dispatch } = useLaunchContext();

  return (
    <Box h="full" bg={`url('${worldmapRed}')`}>
      <Form method="post" action="/settings">
        <Fieldset.Root px="30px" color="lotion">
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
            mx="auto"
            my="0.7em"
            px="6"
            py="2"
            textAlign="center"
            whiteSpace="nowrap"
          >
            CONFIG
          </Heading>
          <Fieldset.Content mt="0">
            <Field label="Game Path" required>
              <SelectRoot
                name="gamePath"
                collection={launchCommands}
                value={[
                  launchCommands.items.find(
                    item => item.value === state.gamePath
                  )?.value || '',
                ]}
                onValueChange={e => {
                  dispatch({ type: 'SET_GAME_PATH', path: e.value[0] });
                }}
                required
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Game Path" />
                </SelectTrigger>
                <SelectContent>
                  {launchCommands.items.map(item => (
                    <SelectItem key={item.value} item={item}>
                      <SelectLabel>{item.label}</SelectLabel>
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
              {!launchCommands.items.find(
                item =>
                  item.value === state.gamePath && item.label !== 'Custom Path'
              ) && (
                <HStack w="full">
                  <Input
                    name="customGamePath"
                    placeholder="Select the HITMAN game folder"
                    value={state.gamePath}
                    onChange={e => {
                      dispatch({
                        type: 'SET_GAME_PATH',
                        path: e.target.value,
                      });
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      void userSelectFolderPath(
                        'Select HITMAN game folder'
                      ).then(path => {
                        if (!path) return;
                        dispatch({
                          type: 'SET_GAME_PATH',
                          path: path,
                        });
                      });
                    }}
                  >
                    <LuFileSearch2 />
                  </Button>
                </HStack>
              )}
            </Field>
            <Field label="Peacock Path">
              <HStack w="full">
                <Input
                  name="peacockPath"
                  value={state.peacockPath}
                  onChange={e => {
                    dispatch({
                      type: 'SET_PEACOCK_PATH',
                      path: e.target.value,
                    });
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    void userSelectFolderPath('Select Peacock Folder')
                  }
                >
                  <LuFileSearch2 />
                </Button>
              </HStack>
            </Field>
            <Button type="submit" variant="surface">
              SAVE
            </Button>
          </Fieldset.Content>
        </Fieldset.Root>
      </Form>
    </Box>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const saveSettingsAction: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  await NeuDB.setKey(
    'gamePath',
    data.get('customGamePath') || data.get('gamePath')
  );
  await NeuDB.setKey('peacockPath', data.get('peacockPath'));

  return redirect('/');
};
