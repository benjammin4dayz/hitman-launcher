import githubIcon from '../../assets/github-icon.svg';
import hitmapsLogo from '../../assets/hitmaps-h.svg';
import { APP_RELEASE_URL } from '../../constants';
import { createWindowAtCursor } from '../../utils/neu';
import { AppBarButton } from '../atoms/AppBarButton';

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
        gap: '0.1em',
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
      <AppBarButton
        glyph={
          <img src={githubIcon} style={{ height: '0.7em' }} draggable="false" />
        }
        onClick={() => {
          createWindowAtCursor(APP_RELEASE_URL, {
            width: 1024,
            height: 768,
          });
        }}
        onHoverStyle={{
          backgroundColor: 'rgba(200, 200, 200, 0.3)',
          boxShadow: '0 0 22px rgba(0, 0, 0, 0.2)',
        }}
        style={buttonStyle}
        title="View this project on GitHub"
      />
    </div>
  );
};
