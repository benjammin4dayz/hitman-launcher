import { useAppContext } from '../../AppProvider';
import { useNeutralinoContext } from '../../NeutralinoProvider';
import { AppBarButton } from '../atoms/AppBarButton';

export const WindowControlButtonGroup = () => {
  const { minimize } = useNeutralinoContext();
  const { shutdown } = useAppContext();

  const buttonStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
    padding: '1em',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        borderRadius: 'inherit',
        width: 'min-content',
      }}
    >
      <AppBarButton
        glyph="—"
        onClick={minimize}
        onHoverStyle={{
          backgroundColor: 'rgba(200, 200, 200, 0.3)',
          boxShadow: '0 0 22px rgba(0, 0, 0, 0.2)',
        }}
        style={buttonStyle}
      />
      <AppBarButton
        glyph="×"
        onClick={shutdown}
        onHoverStyle={{
          backgroundColor: 'rgba(255, 0, 0, 0.77)',
          boxShadow: '0 0 22px rgba(0, 0, 0, 0.5)',
        }}
        style={buttonStyle}
      />
    </div>
  );
};
