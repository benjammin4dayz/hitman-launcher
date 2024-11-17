import PropTypes from 'prop-types';
import { userSelectFolderPath } from '../../utils/neu';
import { NeuDB } from '../../utils/NeuDB';

export const SelectFolderDialog = ({ storageKey, prompt, onChange }) => {
  return (
    <button
      onClick={async () => {
        const folderPath = await userSelectFolderPath(prompt);
        if (folderPath) {
          onChange(folderPath);
          NeuDB.setKey(storageKey, folderPath);
        }
      }}
    >
      Browse
    </button>
  );
};

SelectFolderDialog.propTypes = {
  storageKey: PropTypes.string.isRequired,
  prompt: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
