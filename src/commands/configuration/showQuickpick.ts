import { ExtensionContext } from "vscode";
import { Command } from "../commandManager";
import { ConfigurationQuickPickProvider } from "../../providers";

export default class SettingsCommand implements Command {
  public readonly id = "vscode-dbsnapper.configuration.show.quickpick";
  private _configurationQuickPick: ConfigurationQuickPickProvider;
  public constructor(context: ExtensionContext) {
    this._configurationQuickPick =
      ConfigurationQuickPickProvider.getInstance(context);
  }

  public async execute() {
    this._configurationQuickPick.execute();
  }
}
