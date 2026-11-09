import { execFile } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join } from "node:path";
import { PRESET_APPS } from "../shared/terminal";

const APP_DIRS = ["/Applications", "/System/Applications/Utilities", join(homedir(), "Applications")];

export function isSupported() {
  return process.platform === "darwin";
}

export function installedPresets(): string[] {
  return PRESET_APPS.filter((app) => APP_DIRS.some((dir) => existsSync(join(dir, `${app}.app`))));
}

/** Opens `cwd` in a macOS application with `open -a`, without a shell. */
export function openDirectory(app: string, cwd: string): Promise<void> {
  if (!isSupported()) return Promise.reject(new Error("Ouvrir dans le terminal ne fonctionne que sur un daemon macOS."));
  if (!isAbsolute(cwd) || !existsSync(cwd) || !statSync(cwd).isDirectory())
    return Promise.reject(new Error(`Dossier introuvable : ${cwd}`));
  if (app.startsWith("-")) return Promise.reject(new Error(`Application invalide : ${app}`));

  return new Promise((resolve, reject) => {
    execFile("/usr/bin/open", ["-a", app, cwd], (error, _stdout, stderr) => {
      if (error) reject(new Error(stderr.trim() || `Impossible d'ouvrir ${app}`));
      else resolve();
    });
  });
}
