import type { PluginButtonRegistration, PluginClientContext } from "@getpaseo/plugin/client";
import { openInTerminal } from "../shared/terminal";

type WorkspaceLike = { id: string; workspaceDirectory?: string; projectRootPath: string; archivingAt?: string | null };

/** One "open in terminal" header button per workspace. */
export function registerHeaderButtons(client: PluginClientContext) {
  const buttons = new Map<string, PluginButtonRegistration>();
  let disposed = false;
  let release: (() => void) | null = null;

  const remove = (id: string) => {
    buttons.get(id)?.remove();
    buttons.delete(id);
  };
  const register = (workspace: WorkspaceLike) => {
    if (disposed) return;
    const cwd = workspace.workspaceDirectory ?? workspace.projectRootPath;
    if (workspace.archivingAt || !cwd) return remove(workspace.id);
    remove(workspace.id); // The directory can change; re-register with the current one.
    buttons.set(
      workspace.id,
      client.addHeaderButton({
        id: "open-in-terminal",
        workspaceId: workspace.id,
        button: {
          title: "Ouvrir dans le terminal",
          icon: "SquareTerminal",
          behavior: {
            kind: "action",
            async onPress() {
              await client.rpc(openInTerminal, { cwd });
            },
          },
        },
      }),
    );
  };

  void client.paseo.workspaces
    .list({ subscribe: {} })
    .then(({ subscription }) => {
      release = () => void subscription.release();
      if (disposed) return release();
      subscription.subscribe({
        snapshot: ({ entries }) => {
          const seen = new Set(entries.map((w) => w.id));
          for (const id of [...buttons.keys()]) if (!seen.has(id)) remove(id);
          for (const workspace of entries) register(workspace);
        },
        update: (message) => {
          if (message.type !== "workspace_update") return;
          const update = message.payload;
          if (update.kind === "upsert") register(update.workspace);
          else remove(update.id);
        },
      });
      return undefined;
    })
    .catch((error: unknown) => {
      if (!disposed) console.error("[open-in-terminal] workspace observation failed", error);
    });

  return () => {
    disposed = true;
    release?.();
    for (const id of [...buttons.keys()]) remove(id);
  };
}
