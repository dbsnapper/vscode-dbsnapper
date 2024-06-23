import {
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  ThemeColor,
  window,
  Uri,
} from "vscode";
import { ConfigurationSettingService } from "../../../services";
import { createErrorNotification } from "../../node";

export default class StatusBarServiceProvider {
  private static _instance: StatusBarServiceProvider;
  constructor(private statusBarItem: StatusBarItem) {}

  static init(context: ExtensionContext) {
    try {
      const statusBarItem = window.createStatusBarItem(
        StatusBarAlignment.Right,
        102
      );
      statusBarItem.name = "vscode-dbsnapper";
      statusBarItem.command = "vscode-dbsnapper.configuration.show.quickpick";
      statusBarItem.backgroundColor = new ThemeColor(
        "statusBarItem.errorBackground"
      );
      context.subscriptions.push(statusBarItem);
      StatusBarServiceProvider._instance = new StatusBarServiceProvider(
        statusBarItem
      );
    } catch (error) {
      createErrorNotification(error);
    }
  }

  static get instance(): StatusBarServiceProvider {
    return StatusBarServiceProvider._instance;
  }

  public async showStatusBarInformation(
    icon: string = "vscode-dbsnapper",
    text: string = ""
  ) {
    // get host from baseUrl
    const baseUrl = ConfigurationSettingService.baseUrl;
    const uri = Uri.parse(baseUrl);

    this.statusBarItem.text = `$(${icon}) ${uri.authority} ${text}`;
    this.statusBarItem.backgroundColor = undefined;
    this.statusBarItem.show();
  }

  public async showStatusBarWarning(
    icon: string,
    text: string,
    hostname?: string
  ) {
    if (hostname === undefined) hostname = ConfigurationSettingService.host;
    // get host from baseUrl
    const baseUrl = ConfigurationSettingService.baseUrl;
    const uri = Uri.parse(baseUrl);

    this.statusBarItem.text = `$(${icon}) ${uri.authority} ${text}`;
    this.statusBarItem.backgroundColor = new ThemeColor(
      "statusBarItem.warningBackground"
    );
    this.statusBarItem.show();
  }

  public async showStatusBarError(
    icon: string,
    text: string,
    hostname?: string
  ) {
    if (hostname === undefined) hostname = ConfigurationSettingService.host;
    // get host from baseUrl
    const baseUrl = ConfigurationSettingService.baseUrl;
    const uri = Uri.parse(baseUrl);

    this.statusBarItem.text = `$(${icon}) ${uri.authority} ${text}`;
    this.statusBarItem.backgroundColor = new ThemeColor(
      "statusBarItem.errorBackground"
    );
    this.statusBarItem.show();
  }
}
