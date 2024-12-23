import { useNeutralinoContext } from './NeutralinoProvider';

function App() {
  const { exit } = useNeutralinoContext();

  return (
    <div>
      <p>Hitman Launcher</p>
      <button onClick={exit}>Exit</button>
    </div>
  );
}

export default App;
