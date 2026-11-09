import type { PluginClientContext } from "@getpaseo/plugin/client";
import { registerHeaderButtons } from "./client/header-buttons";
import { TerminalSettingsScreen } from "./client/settings-screen";
import { openInTerminal } from "./shared/terminal";

export default function contribute(client: PluginClientContext) {
  const removers = [
    client.addSettingsScreen({
      id: "terminal",
      title: "Ouvrir dans le terminal",
      icon: "SquareTerminal",
      Component: TerminalSettingsScreen,
    }),
    client.addCommandCenterItem({
      id: "open-in-terminal",
      title: "Ouvrir dans le terminal (iTerm…)",
      icon: "SquareTerminal",
      context: "workspace",
      async onSelect({ rpc, workspace }) {
        await rpc(openInTerminal, { cwd: workspace.directory });
      },
    }),
    registerHeaderButtons(client),
  ];
  return () => removers.forEach((remove) => remove());
}
