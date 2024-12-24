import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { useLaunchContext } from '@/LaunchProvider';
import { NeuDB } from '@/utils';
import { Fieldset, Input } from '@chakra-ui/react';
import { ActionFunction, Form, redirect } from 'react-router-dom';

export default function Settings() {
  const { state, dispatch } = useLaunchContext();

  return (
    <Form method="post" action="/settings">
      <Fieldset.Root>
        <Fieldset.Legend>App Settings</Fieldset.Legend>
        <Fieldset.Content>
          <Field label="Game Path" required>
            <Input
              name="gamePath"
              value={state.gamePath}
              onChange={e => {
                dispatch({ type: 'SET_GAME_PATH', path: e.target.value });
              }}
            />
          </Field>

          <Field label="Peacock Path">
            <Input
              name="peacockPath"
              value={state.peacockPath}
              onChange={e => {
                dispatch({ type: 'SET_PEACOCK_PATH', path: e.target.value });
              }}
            />
          </Field>

          <Button type="submit">OK</Button>
        </Fieldset.Content>
      </Fieldset.Root>
    </Form>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const saveSettingsAction: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  await NeuDB.setKey('gamePath', data.get('gamePath'));
  await NeuDB.setKey('peacockPath', data.get('peacockPath'));

  return redirect('/');
};
