Ouvrir dans le terminal adds a terminal button to every workspace header that opens the workspace directory in your terminal application, iTerm by default. The same action is in the Command Center as "Ouvrir dans le terminal".

Choose the application in Settings > Plugins > Ouvrir dans le terminal: iTerm, Terminal, Ghostty, Warp, WezTerm, kitty, Alacritty, or any other application by name or .app path. Presets that are not found in /Applications are marked. The choice is stored on the host and shared by every client connected to it.

The plugin runs `open -a <application> <workspace directory>` on the daemon machine. It requires a macOS daemon, and with a remote host the terminal opens on that remote machine, not on the device you are using.
