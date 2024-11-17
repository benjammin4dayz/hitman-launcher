import { useState } from 'react';
import PropTypes from 'prop-types';

export const AppBarButton = ({ glyph, glyphStyle, onHoverStyle, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    width: '1.5em',
    height: '1.5em',

    borderRadius: '2px',
    cursor: 'default',
    userSelect: 'none',
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...(props.onClick && { onClick: props.onClick })}
      style={{
        ...buttonStyle,
        ...(isHovered && onHoverStyle),
        ...(props.style || {}),
      }}
      title={props.title}
    >
      <div
        style={{
          fontSize: '2em',
          ...glyphStyle,
        }}
      >
        {glyph}
      </div>
    </div>
  );
};

AppBarButton.propTypes = {
  onHoverStyle: PropTypes.object,
  glyph: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  glyphStyle: PropTypes.object,
  // html props
  style: PropTypes.object,
  onClick: PropTypes.func,
  title: PropTypes.string,
};
