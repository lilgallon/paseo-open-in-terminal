# paseo-open-in-terminal

A [Paseo](https://paseo.sh) plugin that opens a workspace directory in your terminal app (iTerm by default). Paseo's built-in "Open with" list is hardcoded and has no terminal entry.

> Requires Paseo >= 0.15.3 and a macOS daemon.

## Install

```bash
paseo plugin install github:lilgallon/paseo-open-terminal
```

## Usage

- Terminal icon button in the workspace header.
- ⌘K → **Ouvrir dans le terminal (iTerm…)**.
- Settings → Plugins → **Ouvrir dans le terminal** to pick iTerm, Terminal, Ghostty, Warp, WezTerm, kitty, Alacritty, or any other app.

Runs `open -a <app> <workspace directory>` on the daemon machine.

## License

MIT
