import * as Neutralino from '@neutralinojs/lib';

export function safelyCall(
  fn: ((...args: unknown[]) => void) | undefined,
  ...args: unknown[]
) {
  if (!fn) return;
  try {
    fn(args);
  } catch (e) {
    console.error(e);
  }
}

export async function userSelectFolderPath(message: string) {
  let folderPath = '';

  try {
    folderPath = await Neutralino.os.showFolderDialog(message, {
      defaultPath: window.NL_PATH,
    });
  } catch (e) {
    console.error(e);
  }

  return folderPath || null;
}

export type SpawnOptions = {
  processPath: string;
  processName?: string;
  onStdOut?: (...args: unknown[]) => void;
  onStdErr?: (...args: unknown[]) => void;
  onExit?: (...args: unknown[]) => void;
};

export async function spawn(
  { processPath, processName, onStdOut, onStdErr, onExit }: SpawnOptions = {
    processPath: '',
    processName: 'process',
  }
) {
  const proc = await Neutralino.os.spawnProcess(processPath);
  console.log(`Spawned ${processName} with id ${proc.id} and pid ${proc.pid}`);

  const evtHandler = (
    evt: CustomEvent<{ id: number; action: string; data: unknown }>
  ) => {
    if (proc.id === evt.detail.id) {
      switch (evt.detail.action) {
        case 'stdOut':
          safelyCall(onStdOut, evt.detail.data);
          console.log(evt.detail.data);
          break;
        case 'stdErr':
          safelyCall(onStdErr, evt.detail.data);
          console.error(evt.detail.data);
          break;
        case 'exit':
          safelyCall(onExit, evt.detail.data);
          console.log(
            `${processName} exited with code: ${evt.detail.data as string}`
          );
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

/** TODO: Submit a PR to fix this typedef @neutralinojs */
export interface WindowOptions extends Neutralino.WindowOptions {
  transparent?: boolean;
}

export async function createWindowAtCursor(
  url: string,
  options: WindowOptions
) {
  const { x, y } = await Neutralino.window.getPosition();

  return Neutralino.window.create(url, {
    ...options,
    x,
    y,
    borderless: false,
    enableInspector: import.meta.env.DEV ? true : false,
    exitProcessOnClose: true,
    resizable: true,
    transparent: false,
  } as WindowOptions);
}

export type ProcessWatcherOptions = {
  processName: string;
  onProcessStart?: (...args: unknown[]) => void;
  onProcessEnd?: (...args: unknown[]) => void;
};

export class ProcessWatcher {
  public processName: string;
  private onProcessStart?: (...args: unknown[]) => void;
  private onProcessEnd?: (...args: unknown[]) => void;
  lastState = false;
  interval: number | null = null;

  constructor({
    processName,
    onProcessStart,
    onProcessEnd,
  }: ProcessWatcherOptions) {
    this.processName = processName;
    this.onProcessStart = onProcessStart;
    this.onProcessEnd = onProcessEnd;
  }

  startWatcher(intervalDuration = 1000) {
    this.interval = setInterval(async () => {
      const pid = await this.#ps();

      if (this.lastState && !pid) {
        safelyCall(this.onProcessEnd);
      } else if (!this.lastState && pid) {
        safelyCall(this.onProcessStart, pid);
        this.stopWatcher();
        this.startWatcher(intervalDuration * 3);
      }

      this.lastState = !!pid;
    }, intervalDuration);
  }

  stopWatcher() {
    if (!this.interval) return;
    clearInterval(this.interval);
    this.interval = null;
  }

  async #ps() {
    let cmd;

    switch (window?.NL_OS.toLowerCase()) {
      case 'windows':
        // Write process pid or 0 to stdout
        cmd = `@echo off & for /f "tokens=2" %a in ('tasklist /FI "IMAGENAME eq ${this.processName}" /NH') do (if "%a" == "" (echo 0) else if "%a" == "No" (echo 0) else (echo %a))`;
        break;
      default:
        break;
    }

    if (!cmd) return -1;

    const result = await Neutralino.os.execCommand(cmd);

    return Number(result.stdOut);
  }
}

export class NeuDB {
  // db-v1: 0.1.0 - 0.3.0
  // db-v2: >= 0.4.0
  static name = 'db-v2';

  static async getKey(key: string) {
    const db = await NeuDB.get();
    return db[key];
  }

  static async setKey(key: string, value: unknown) {
    const db = await NeuDB.get();
    Object.assign(db, { [key]: value });
    return await Neutralino.storage.setData(NeuDB.name, JSON.stringify(db));
  }

  static async get() {
    let serial = '',
      data: Record<string, unknown> = {};

    try {
      serial = await Neutralino.storage.getData(NeuDB.name);
    } catch (e) {
      if ((e as { code?: string })?.code !== 'NE_ST_NOSTKEX') throw e;
      console.log('Creating DB');
      await Neutralino.storage.setData(NeuDB.name, '{}');
    }

    try {
      data = JSON.parse(serial) as Record<string, unknown>;
    } catch (e) {
      console.log(e);
    }

    return data;
  }
}
