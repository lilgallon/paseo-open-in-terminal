import type { PluginServerContext } from "@getpaseo/plugin/server";
import { installedPresets, isSupported, openDirectory } from "./server/terminal";
import { listTerminalApps, openInTerminal, terminalSettings } from "./shared/terminal";

export default function contribute(server: PluginServerContext) {
  const settings = server.registerSettings(terminalSettings);

  server.handle(openInTerminal, async ({ cwd }) => {
    const state = await settings.read();
    const app = state.status === "ready" ? state.values.app : "iTerm";
    await openDirectory(app, cwd);
    return { app };
  });

  server.handle(listTerminalApps, () => ({ supported: isSupported(), installed: installedPresets() }));

  return () => {};
}
