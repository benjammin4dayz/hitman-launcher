import { useEffect, useRef, useState } from 'react';
import { useNeutralinoContext } from '../../NeutralinoProvider';
import { WindowControlButtonGroup } from '../molecules/WindowControlButtonGroup';
import { AppBarButtonGroup } from '../molecules/AppBarButtonGroup';

export const AppBar = () => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const { setDragHandle } = useNeutralinoContext();

  useEffect(() => {
    setDragHandle(ref.current);
  }, [setDragHandle]);

  return (
    <header
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        borderTopRightRadius: 'inherit',
        borderTopLeftRadius: 'inherit',
        backgroundImage:
          'linear-gradient(to bottom, rgba(102, 2, 0, 1), rgba(102, 2, 0, 0))',
        boxShadow: isHovered ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
        backgroundColor: !isHovered ? 'transparent' : 'rgba(102, 2, 0, 0.33)',
        transition: '0.3s ease',
        overflow: 'hidden',
        paddingLeft: '1em',
      }}
    >
      <AppBarButtonGroup />
      <div ref={ref} style={{ flex: 1 }}></div>
      <WindowControlButtonGroup />
    </header>
  );
};
