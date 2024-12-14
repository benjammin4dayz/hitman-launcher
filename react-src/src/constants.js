import pkg from '../../package.json';

export const APP_VERSION = pkg.version;

export const APP_RELEASE_URL =
  (pkg.repository?.url || pkg.repository) + '/releases/latest';

export const APP_MANIFEST_URL =
  'https://raw.githubusercontent.com/benjammin4dayz/hitman-launcher/refs/heads/main/package.json';

/** The binary file that provides Peacock's patching functionality. */
export const PATCHER_EXECUTABLE = 'PeacockPatcher.exe';

/** The script to start the Peacock server. Shipped with Peacock. */
export const SERVER_EXECUTABLE = 'Start Server.cmd';

/**
 * This isn't directly executable when the binary is packed with DRM. However,
 * it might spawn the launcher (e.g. Steam) in order to validate the license.
 */
export const GAME_EXECUTABLE = 'Retail/HITMAN3.exe';

/** Commands to launch HITMAN via Steam's browser protocol */
export const STEAM_LAUNCH_CMD = {
  HITMAN_WOA: 'steam://launch/1659040',
  HITMAN_FREE: 'steam://launch/1847520',
};

export const BACKGROUNDS = ['bg-cover1.jpg', 'bg-cover2.jpg', 'bg-cover3.jpg'];
