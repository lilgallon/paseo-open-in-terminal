import { defineRpc, defineSettings } from "@getpaseo/plugin";
import { z } from "zod";

/** macOS application names accepted by `open -a`. */
export const PRESET_APPS = ["iTerm", "Terminal", "Ghostty", "Warp", "WezTerm", "kitty", "Alacritty"] as const;

export const terminalSettings = defineSettings({
  id: "terminal",
  scope: "host",
  version: 1,
  schema: z.object({
    /** Application name or absolute .app path, passed to `open -a`. */
    app: z.string().min(1).default("iTerm"),
  }),
});

export const openInTerminal = defineRpc({
  name: "terminal.open",
  input: z.object({ cwd: z.string().min(1) }),
  output: z.object({ app: z.string() }),
});

export const listTerminalApps = defineRpc({
  name: "terminal.apps",
  input: z.object({}),
  output: z.object({
    supported: z.boolean(),
    installed: z.array(z.string()),
  }),
});
