import {
  ExtensionContext,
  QuickPickItem,
  QuickPickItemKind,
  ThemeIcon,
  window,
} from "vscode";
import { quickPickSetupDBSnapper } from "../../utilities/quickPicks";
import { VSCODE_DBSNAPPER_EXTENSION } from "../../constants";
import { getFeatureFlag } from "../../apis/vscode";
import { ConfigurationSettingService } from "../../services";

export class ConfigurationQuickPickProvider {
  private static instance: ConfigurationQuickPickProvider;
  private context: ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  public static getInstance(
    context: ExtensionContext
  ): ConfigurationQuickPickProvider {
    if (!ConfigurationQuickPickProvider.instance) {
      ConfigurationQuickPickProvider.instance =
        new ConfigurationQuickPickProvider(context);
    }
    return ConfigurationQuickPickProvider.instance;
  }

  public async execute(): Promise<void> {
    const quickPickItems = BuildQuickPickItems();
    this.showQuickPick(quickPickItems);
    quickPickSetupDBSnapper(this.context);
  }

  private async showQuickPick(items: QuickPickItem[]): Promise<QuickPickItem> {
    return new Promise((resolve) => {
      const quickPick = window.createQuickPick();
      quickPick.items = items;
      quickPick.onDidChangeSelection((selection) => {
        if (selection[0]) {
          resolve(selection[0]);
          quickPick.dispose();
        }
      });
      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.title = "Setup DBSnapper Cloud";
      quickPick.show();
    });
  }
}

function BuildQuickPickItems(): QuickPickItem[] {
  const quickPickServiceProviders = BuildQuickPickServiceProviders();

  return [...quickPickServiceProviders];
}

function BuildQuickPickServiceProviders(): QuickPickItem[] {
  const quickPickItemTypes: QuickPickItem[] = [
    {
      label: "Service Provider",
      kind: QuickPickItemKind.Separator,
    },
    {
      label: "DBSnapper Platform",
      description: "Setup DBSnapper Cloud",
    },
  ];
  return quickPickItemTypes;
}
