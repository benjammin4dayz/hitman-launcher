import * as Neutralino from '@neutralinojs/lib';

export class ProcessWatcher {
  procName;
  onProcStart = () => {};
  onProcEnd = () => {};
  lastProcState = false;
  interval = null;

  constructor(procName, { onProcStart, onProcEnd }) {
    this.procName = procName;
    this.onProcStart = onProcStart || this.onProcStart;
    this.onProcEnd = onProcEnd || this.onProcEnd;
  }

  startWatcher(intervalDuration = 1000) {
    this.interval = setInterval(async () => {
      const pid = await this.#ps();

      if (this.lastProcState && !pid) {
        this.onProcEnd();
      } else if (!this.lastProcState && pid) {
        this.onProcStart(pid);
        this.stopWatcher();
        this.startWatcher(intervalDuration * 3);
      }

      this.lastProcState = !!pid;
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
        cmd = `@echo off & for /f "tokens=2" %a in ('tasklist /FI "IMAGENAME eq ${this.procName}" /NH') do (if "%a" == "" (echo 0) else if "%a" == "No" (echo 0) else (echo %a))`;
        break;
      default:
        break;
    }

    if (!cmd) return -1;

    const result = await Neutralino.os.execCommand(cmd);

    return Number(result.stdOut);
  }
}
