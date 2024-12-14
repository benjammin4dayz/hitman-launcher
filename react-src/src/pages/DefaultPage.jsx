import { useSwitchTransition } from '@vanyapr/transition-hook';
import { useState } from 'react';
import { useAppContext } from '../AppProvider';
import { Box } from '../components/atoms/Box';
import { Config } from '../components/molecules/Config';
import { StatusDisplay } from '../components/molecules/StatusDisplay';
import { VersionTag } from '../components/molecules/VersionTag';
import { AppBar } from '../components/organisms/AppBar';
import { Launcher } from '../components/organisms/Launcher';
import { APP_MANIFEST_URL, APP_RELEASE_URL, APP_VERSION } from '../constants';

export const DefaultPage = () => {
  const { background, patcher, server, game, gamePath } = useAppContext();
  const [configuring, setConfiguring] = useState(!gamePath ? true : false);

  const transition = useSwitchTransition(configuring, 250, 'out-in');
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        borderRadius: '10px',
      }}
    >
      <AppBar />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '50px 50px 0 25px',
          width: '400px',
        }}
      >
        <h2 style={{ fontSize: '32px', marginTop: '0' }}>
          <Box
            slotL={<span style={{ letterSpacing: '0.4rem' }}>HITMAN</span>}
            slotR={<span style={{ margin: '0.5rem' }}>III</span>}
            outlineColor="white"
          />
        </h2>
        <br />
        {transition((state, stage) => (
          <div
            style={{
              zIndex: 1,
              transition: '.3s',
              opacity: stage === 'enter' ? 1 : 0,
              transform: {
                from: 'translateX(100%) scale(1.2)',
                enter: 'translateX(0)',
                leave: 'translateX(-100%) scale(0)',
              }[stage],
            }}
          >
            {state ? (
              <>
                <Config />
                <button onClick={() => setConfiguring(false)}>OK</button>
              </>
            ) : (
              <>
                <StatusDisplay patcher={patcher} server={server} game={game} />
                <div style={{ display: 'flex', marginTop: '1rem', gap: '5px' }}>
                  <Launcher style={{ flex: 1, padding: '1rem' }} />
                  <button onClick={() => setConfiguring(true)}>⚙️</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <VersionTag
        style={{ position: 'absolute', bottom: '0px', right: '10px' }}
        version={APP_VERSION}
        manifestURL={APP_MANIFEST_URL}
        updateURL={APP_RELEASE_URL}
      />
    </div>
  );
};
