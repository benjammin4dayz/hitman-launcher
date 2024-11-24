import * as Neutralino from '@neutralinojs/lib';

export async function userSelectFolderPath(message) {
  const folderPath = await Neutralino.os.showFolderDialog(message, {
    defaultPath: window.NL_PATH,
  });

  return folderPath ? folderPath : null;
}

export async function spawn(
  procPath,
  {
    procName = 'process',
    onStdOut = () => {},
    onStdErr = () => {},
    onBeforeClose = () => {},
  } = {}
) {
  const proc = await Neutralino.os.spawnProcess(procPath);
  console.log(`Spawned ${procName} with id ${proc.id} and pid ${proc.pid}`);

  const evtHandler = evt => {
    if (proc.id === evt.detail.id) {
      switch (evt.detail.action) {
        case 'stdOut':
          onStdOut(evt);
          console.log(evt.detail.data);
          break;
        case 'stdErr':
          onStdErr(evt);
          console.error(evt.detail.data);
          break;
        case 'exit':
          onBeforeClose(evt);
          console.log(`${procName} exited with code: ${evt.detail.data}`);
          break;
      }
    }
  };

  await Neutralino.events.on('spawnedProcess', evtHandler);

  return {
    exit: async () => {
      await Neutralino.os.updateSpawnedProcess(proc.id, 'exit');
      await Neutralino.events.off('spawnedProcess', evtHandler);
    },
  };
}

export async function createWindowAtCursor(url, options) {
  const { x, y } = await Neutralino.window.getPosition();

  return Neutralino.window.create(url, {
    x,
    y,
    borderless: false,
    enableInspector: import.meta.env.DEV ? true : false,
    exitProcessOnClose: true,
    resizable: true,
    transparent: false,
    ...options,
  });
}
