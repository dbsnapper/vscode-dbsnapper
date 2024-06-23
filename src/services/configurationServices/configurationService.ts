import { workspace } from "vscode";
import {
  createDebugNotification,
  createErrorNotification,
} from "../../apis/node";

export default class ConfigurationService {
  protected getConfigValue<T>(configName: string): T {
    const ws = workspace.getConfiguration("vscode-dbsnapper");
    return ws.get(configName) as T;
  }

  protected setConfigValue<T>(configName: string, value: T): void {
    const ws = workspace.getConfiguration("vscode-dbsnapper");
    const setAsGlobal = ws.inspect(configName)?.workspaceValue == undefined;
    ws.update(configName, value, setAsGlobal)
      .then(() => {
        createDebugNotification(`setting ${configName} ${value}`);
      })
      .then(undefined, (err) => {
        createErrorNotification(`${err}`);
      });
  }
}
