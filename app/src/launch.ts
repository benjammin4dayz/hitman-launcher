import { Action } from '@/launchReducer';
import { ProcessWatcher, spawn } from '@/utils';
import * as Neutralino from '@neutralinojs/lib';
import { Dispatch } from 'react';

export async function spawnNeutralinoManagedProcess({
  name,
  path,
  dispatch,
  onError,
  onExit,
}: {
  name: string;
  path: string;
  dispatch: Dispatch<Action>;
  onError?: (error: string) => void;
  onExit?: () => void;
}) {
  const dispatchStartAction = () => {
    //@ts-expect-error handled by default case
    dispatch({ type: `${name.toUpperCase()}_STARTED` });
  };
  const dispatchStopAction = () => {
    //@ts-expect-error handled by default case
    dispatch({ type: `STOP_${name.toUpperCase()}` });
  };

  const ref = await spawn({
    processPath: path,
    processName: name,
    onStdErr: evt => {
      if (typeof evt !== 'string') {
        console.warn(
          'Unexpected response from process! Expected string but received type:',
          typeof evt
        );
        return;
      }
      if (evt.includes('is not recognized as an internal or external')) {
        onError?.(
          `${name.charAt(0).toUpperCase() + name.slice(1)} failed to launch`
        );
        dispatchStopAction();
      } else if (evt.includes('The system cannot find the')) {
        onError?.(`Invalid ${name} path`);
        dispatchStopAction();
      }
    },
    onExit: () => {
      onExit?.();
      dispatchStopAction();
    },
  });

  dispatchStartAction();
  return ref;
}

export function spawnSelfManagedProcess({
  name,
  launchTarget,
  onStart,
  onEnd,
}: {
  name: string;
  launchTarget: string;
  onStart?: (pid: string | number) => void;
  onEnd?: () => void;
}) {
  console.log(`[ProcessWatcher] Spawning ${name} with ${launchTarget}...`);
  const watcher = new ProcessWatcher({
    processName: name,
    onProcessStart: pid => {
      onStart?.(pid);
    },
    onProcessEnd: () => {
      onEnd?.();
      watcher.stopWatcher();
    },
  });
  watcher.startWatcher(1000);
  void Neutralino.os.spawnProcess(`cmd /c start ${launchTarget}`);
}
