import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Text } from "react-native";
import { useRpc, useSettings, type PluginSurfaceProps } from "@getpaseo/plugin/client";
import { SettingsAction, SettingsCard, SettingsInput, SettingsSection, SettingsSelect } from "@getpaseo/plugin/client/ui";
import { listTerminalApps, PRESET_APPS, terminalSettings } from "../shared/terminal";

const CUSTOM = "__custom__";

export function TerminalSettingsScreen({ theme }: PluginSurfaceProps) {
  const settings = useSettings(terminalSettings);
  const fetchApps = useRpc(listTerminalApps);
  const apps = useQuery({ queryKey: ["terminal-apps"], queryFn: () => fetchApps({}) });
  const [customMode, setCustomMode] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const muted = { color: theme.colors.foregroundMuted, fontSize: 12 };

  if (settings.status === "loading") return <Text style={muted}>Chargement…</Text>;
  if (settings.status !== "ready")
    return (
      <Text style={{ color: theme.colors.statusDanger, fontSize: 12 }} onPress={() => void settings.reset()}>
        Réglages illisibles : {settings.error}. Appuie pour réinitialiser.
      </Text>
    );

  const { app } = settings.values;
  const installed = apps.data?.installed ?? [];
  const isPreset = !customMode && (PRESET_APPS as readonly string[]).includes(app);
  const options = [
    ...PRESET_APPS.map((name) => ({
      value: name as string,
      label: apps.data && !installed.includes(name) ? `${name} (non trouvé)` : name,
    })),
    { value: CUSTOM, label: "Autre application…" },
  ];
  const save = (next: string) => {
    const trimmed = next.trim();
    if (trimmed && trimmed !== app) void settings.save({ app: trimmed }, settings.revision);
  };

  return (
    <SettingsSection title="Application">
      <SettingsCard>
        <SettingsSelect
          label="Ouvrir les workspaces avec"
          hint="Utilisé par le bouton terminal de l'en-tête et par ⌘K."
          value={isPreset ? app : CUSTOM}
          options={options}
          onValueChange={(value) => {
            setCustomMode(value === CUSTOM);
            setDraft(null);
            if (value !== CUSTOM) save(value);
          }}
          error={settings.saveError ?? (apps.data && !apps.data.supported ? "Le daemon n'est pas sous macOS." : null)}
        />
        {isPreset ? null : (
          <SettingsInput
            label="Nom ou chemin de l'application"
            hint="Passé à `open -a`, par exemple « Hyper » ou « /Applications/Tabby.app »."
            initialValue={(PRESET_APPS as readonly string[]).includes(app) ? "" : app}
            placeholder="Hyper"
            onChangeText={setDraft}
          />
        )}
        {isPreset ? null : (
          <SettingsAction
            label={`Actuellement : ${app}`}
            actionLabel="Enregistrer"
            disabled={!draft?.trim() || draft.trim() === app || settings.saving}
            onPress={() => {
              if (draft) save(draft);
              setCustomMode(false);
            }}
          />
        )}
      </SettingsCard>
    </SettingsSection>
  );
}
