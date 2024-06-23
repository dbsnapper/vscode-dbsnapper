import { ExtensionContext, workspace } from "vscode";
import { createErrorNotification } from "../../apis/node";
import { ManagedApiKey } from "./managedApiKey";
import { StatusBarServiceProvider } from "../../apis/vscode";

export function registerConfigurationMonitorService(
  _context: ExtensionContext
): void {
  try {
    const managedApiKeyInstance = ManagedApiKey.getInstance();
    const eventAffectsConfigurations = [
      "vscode-dbsnapper.defaultDstDbUrl",
      "vscode-dbsnapper.baseUrl",
    ];

    workspace.onDidChangeConfiguration(async (event) => {
      try {
        console.log("event.affectsConfiguration(config)", event);
        console.log(
          "affects vscode-dbsnapper.baseUrl?",
          event.affectsConfiguration("vscode-dbsnapper.baseUrl")
        );
        if (
          eventAffectsConfigurations.some((config) =>
            event.affectsConfiguration(config)
          )
        ) {
          console.log("Event affects - updating");
          await managedApiKeyInstance.verify();
        } else {
          console.log("Event does not affect - skipping");
          // await managedApiKeyInstance.verify();
        }
      } catch (error) {
        console.log("Event affects - error", error);

        createErrorNotification(error);
      }
    });
  } catch (error) {
    createErrorNotification(error);
  }
}
