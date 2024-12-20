import { SelectFolderDialog } from '../atoms/SelectFolderDialog';
import { useAppContext } from '../../AppProvider';
import { BACKGROUNDS, STEAM_LAUNCH_CMD } from '../../constants';
import { NeuDB } from '../../utils/NeuDB';

export const Config = () => {
  const {
    background,
    setBackground,
    gamePath,
    setGamePath,
    saveGamePath,
    peacockPath,
    setPeacockPath,
    savePeacockPath,
  } = useAppContext();

  const handleSetBackground = e => {
    setBackground(BACKGROUNDS[e.target.value]);
    NeuDB.setKey('background', BACKGROUNDS[e.target.value]);
  };

  return (
    <fieldset
      style={{
        border: '3px solid white',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingBottom: '1rem',
      }}
    >
      <legend>Launcher Configuration</legend>
      <label>
        Hitman path
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <input
            type="text"
            value={gamePath}
            onChange={e => setGamePath(e.target.value)}
            onBlur={saveGamePath}
            list="gamePathOptions"
            style={{ flex: 1 }}
          />
          <datalist id="gamePathOptions">
            <option value={STEAM_LAUNCH_CMD.HITMAN_WOA}>
              HITMAN: World of Assassination
            </option>
            <option value={STEAM_LAUNCH_CMD.HITMAN_FREE}>
              HITMAN: Free Starter Pack
            </option>
          </datalist>
          <SelectFolderDialog
            storageKey="gamePath"
            prompt="Select Hitman 3 Directory"
            onChange={setGamePath}
          />
        </div>
      </label>
      <label>
        Peacock path
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <input
            type="text"
            value={peacockPath}
            onChange={e => setPeacockPath(e.target.value)}
            onBlur={savePeacockPath}
            style={{ flex: 1 }}
          />
          <SelectFolderDialog
            storageKey="peacockPath"
            prompt="Select Peacock Directory"
            onChange={setPeacockPath}
          />
        </div>
      </label>
      <label>
        Background
        <div>
          <input
            type="range"
            min="0"
            max={BACKGROUNDS.length - 1}
            value={BACKGROUNDS.indexOf(background)}
            onChange={handleSetBackground}
            list="background-options"
          />
          <datalist id="background-options">
            {BACKGROUNDS.map((bg, index) => (
              <option key={`${index}-${bg}`} value={index}>
                {bg}
              </option>
            ))}
          </datalist>
        </div>
      </label>
    </fieldset>
  );
};
