import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import semver from 'semver';
import { createWindowAtCursor } from '../../utils/neu';

export const VersionTag = ({ version, manifestURL, updateURL, ...props }) => {
  const availableVersion = useRef(null);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (!manifestURL || availableVersion.current) return;
    fetch(manifestURL)
      .then(res => res.json())
      .then(pkg => {
        if (
          semver.valid(pkg.version) &&
          semver.valid(version) &&
          semver.gt(pkg.version, version)
        ) {
          availableVersion.current = pkg.version;
          setShowUpdate(true);
          const showUpdateTimeout = setTimeout(() => {
            setShowUpdate(false);
          }, 10000);
          return () => clearTimeout(showUpdateTimeout);
        }
      })
      .catch(err => {
        console.error(err.message);
        console.trace(err.stack);
      });
  }, [version, manifestURL]);

  return (
    <div {...props}>
      {showUpdate ? (
        <span>
          <a
            href="#"
            onClick={() => {
              createWindowAtCursor(updateURL, {
                width: 1024,
                height: 768,
              });
            }}
          >
            New version available!
          </a>
        </span>
      ) : (
        <span
          title={
            availableVersion.current
              ? 'Update available on GitHub!'
              : 'Up to date!'
          }
          style={{
            cursor: availableVersion.current ? 'help' : 'default',
            fontSize: '0.75rem',
          }}
        >
          v{version}
          {import.meta.env.DEV ? '-dev' : ''}
        </span>
      )}
    </div>
  );
};

VersionTag.propTypes = {
  version: PropTypes.string.isRequired,
  manifestURL: PropTypes.string,
  updateURL: PropTypes.string,
};
