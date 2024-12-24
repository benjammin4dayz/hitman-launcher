import RootLayout from '@/layouts/RootLayout';
import Main from '@/pages/Main';
import Settings, { saveSettingsAction } from '@/pages/Settings';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Main />} />
      <Route
        path="settings"
        element={<Settings />}
        action={saveSettingsAction}
      />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
