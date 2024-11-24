import hitmapsLogo from '../../assets/hitmaps-h.svg';
import { AppBarButton } from '../atoms/AppBarButton';
import { createWindowAtCursor } from '../../utils/neu';

export const AppBarButtonGroup = () => {
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
        gap: '0.5em',
      }}
    >
      <AppBarButton
        glyph={
          <img
            src={hitmapsLogo}
            style={{ height: '0.7em', boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)' }}
            draggable="false"
          />
        }
        onClick={() => {
          createWindowAtCursor('https://www.hitmaps.com/', {
            width: 800,
            height: 725,
            title: 'HITMAPS - Interactive Maps for the Hitman Series',
          });
        }}
        onHoverStyle={{
          backgroundColor: 'rgba(200, 200, 200, 0.3)',
          boxShadow: '0 0 22px rgba(0, 0, 0, 0.2)',
        }}
        style={buttonStyle}
        title="HITMAPS"
      />
    </div>
  );
};
