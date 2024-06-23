import { ExtensionContext, Disposable } from "vscode";
import { CommandManager } from "./commandManager";
import { ConfigurationShowQuickpick } from "./configuration";

export { CommandManager };
export function registerVscodeDBSnapperCommands(
  context: ExtensionContext,
  commandManager: CommandManager
): Disposable {
  // Configuration
  commandManager.register(new ConfigurationShowQuickpick(context));

  return commandManager;
}
