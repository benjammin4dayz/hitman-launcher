import RootLayout from '@/layouts/RootLayout';
import Main from '@/pages/Main';
import Settings, { saveSettingsAction } from '@/pages/Settings';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { useLaunchContext } from './LaunchProvider';
import { useNeutralinoContext } from './NeutralinoProvider';
import * as Neutralino from '@neutralinojs/lib';
import { useEffect } from 'react';
import About from './pages/About';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Main />} />
      <Route
        path="/settings"
        element={<Settings />}
        action={saveSettingsAction}
      />
      <Route path="/about" element={<About />} />
    </Route>
  )
);

function App() {
  const { exit } = useNeutralinoContext();
  const { dispatch } = useLaunchContext();

  useEffect(() => {
    void Neutralino.events.on('windowClose', () => {
      dispatch({ type: 'SHUTDOWN' });
      setTimeout(() => {
        exit();
      }, Math.random() * 65 + 10); // Allow time for processes to stop
    });
  }, [dispatch, exit]);

  return <RouterProvider router={router} />;
}

export default App;
