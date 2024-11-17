import { useTransition } from '@vanyapr/transition-hook';
import { useEffect, useState } from 'react';
import './App.css';
import { useNeutralinoContext } from './NeutralinoProvider';
import { DefaultPage } from './pages/DefaultPage';

const LOADING_TIMEOUT = 1000;
const TRANSITION_TIMEOUT = 500; // ms

function App() {
  const [appLoaded, setAppLoaded] = useState(false);

  const { ready } = useNeutralinoContext();
  const { stage, shouldMount } = useTransition(appLoaded, TRANSITION_TIMEOUT);

  useEffect(() => {
    if (ready) {
      // neutralino window can flash before content is finished rendering
      const arbitraryLoadTimeout = setTimeout(() => {
        setAppLoaded(true);
      }, LOADING_TIMEOUT);

      return () => clearTimeout(arbitraryLoadTimeout);
    }
  }, [ready]);

  return (
    shouldMount && (
      <div
        style={{
          opacity: stage === 'enter' ? 1 : 0,
          transition: TRANSITION_TIMEOUT + 'ms ease',
        }}
      >
        <DefaultPage />
      </div>
    )
  );
}

export default App;
