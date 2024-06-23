// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CommandManager, registerVscodeDBSnapperCommands } from "./commands";
import { StatusBarServiceProvider } from "./apis/vscode";
import { registerVscodeDBSnapperServices } from "./services";
import {
  createDebugNotification,
  createErrorNotification,
  createInfoNotification,
} from "./apis/node";
import { TargetsTreeDataProvider, TargetsTreeItem } from "./providers";
import { CommandTextOutputProvider } from "./providers";
import { disableServiceFeature } from "./services/featureFlagServices";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  try {
    console.log(
      'Congratulations, your extension "vscode-dbsnapper" is now active!'
    );

    createInfoNotification("activate vscode-dbsnapper");

    createDebugNotification("initialize components");
    // INIT Status Bar Provider
    StatusBarServiceProvider.init(context);
    StatusBarServiceProvider.instance.showStatusBarInformation();

    // Register Services
    registerVscodeDBSnapperServices(context);

    // registerCommands
    createDebugNotification("initialize vscode commands");
    const commandManager = new CommandManager();
    context.subscriptions.push(
      registerVscodeDBSnapperCommands(context, commandManager)
    );

    // **** REGISTER TREE VIEW PROVIDER ****
    const targetsTreeDataProvider = new TargetsTreeDataProvider(context);
    const commandTextOutputProvider = new CommandTextOutputProvider();
    vscode.window.registerTreeDataProvider(
      "vscode-dbsnapper.targets.view.sidebar",
      targetsTreeDataProvider
    );

    // Command output Text Document Provider
    vscode.workspace.registerTextDocumentContentProvider(
      "commandTextOutputProvider",
      commandTextOutputProvider
    );

    vscode.commands.registerCommand("vscode-dbsnapper.targets.refresh", () =>
      targetsTreeDataProvider.refresh()
    );
    vscode.commands.registerCommand(
      "vscode-dbsnapper.targets.snapshot.load",
      (e) => targetsTreeDataProvider.snapshotLoad(e)
    );

    createInfoNotification("vscode-dbsnapper ready");
  } catch (error: unknown) {
    createErrorNotification(error);
  }
}
// This method is called when your extension is deactivated
export function deactivate() {}
