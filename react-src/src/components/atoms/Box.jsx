import PropTypes from 'prop-types';
import styles from './Box.module.css';

export const Box = ({ outlineColor = 'black', slotL, slotR }) => {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.slotContainerL}
        style={{
          outline: `3px solid ${outlineColor}`,
        }}
      >
        <div>{slotL}</div>
      </div>
      <div
        className={styles.slotContainerR}
        style={{ outline: `3px solid ${outlineColor}` }}
      >
        <div>{slotR}</div>
      </div>
    </div>
  );
};

Box.propTypes = {
  slotL: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  slotR: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  outlineColor: PropTypes.string,
};
