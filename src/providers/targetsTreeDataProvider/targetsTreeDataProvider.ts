import * as cp from "child_process";
import * as vscode from "vscode";
import { ConfigurationSettingService } from "../../services";
import { SecretStorageService } from "../../apis/vscode";
import { TargetsTreeItem } from "./targetsTreeItem";
import { SnapshotsTreeItem } from "./snapshotsTreeItem";
import { GetTargets, GetTargetSnapshots } from "../../apis";

export class TargetsTreeDataProvider
  implements vscode.TreeDataProvider<TargetsTreeItem>
{
  // Refresh events
  private _onDidChangeTreeData: vscode.EventEmitter<
    TargetsTreeItem | undefined | null | void
  > = new vscode.EventEmitter<TargetsTreeItem | undefined | null | void>();

  readonly onDidChangeTreeData: vscode.Event<
    TargetsTreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  // Constructor
  constructor(context: vscode.ExtensionContext) {
    const view = vscode.window.createTreeView(
      "vscode-dbsnapper.targets.view.sidebar",
      {
        treeDataProvider: this,
        showCollapseAll: true,
        canSelectMany: false,
      }
    );
    context.subscriptions.push(view);
  }

  // Must implement getTreeItem and getChildren

  // getTreeItem
  getTreeItem(element: TargetsTreeItem): TargetsTreeItem {
    return element;
  }

  // getChildren
  public async getChildren(
    _element: TargetsTreeItem
  ): Promise<TargetsTreeItem[]> {
    const dbsnapperTreeItems: Array<TargetsTreeItem> = [];
    // If we're passing in an element, we want the snapshots
    if (_element) {
      // Get the snapshots of the selected target
      return Promise.resolve(
        this.getTargetSnapshots(_element.id, _element.name)
      );
    } else {
      // Otherwise root - get all targets
      const targets = await GetTargets();
      // Sort the targets by name
      targets.sort((a: any, b: any) => {
        return a.name.localeCompare(b.name);
      });

      targets.forEach((target: any) => {
        const targetItem = new TargetsTreeItem(
          target.id,
          target.name,
          vscode.TreeItemCollapsibleState.Collapsed
        );
        dbsnapperTreeItems.push(targetItem);
      });
    }
    return dbsnapperTreeItems;
  }

  public async getTargetSnapshots(targetID: string, targetName: string) {
    const snapshots = await GetTargetSnapshots(targetID);
    const snapshotItems: Array<SnapshotsTreeItem> = [];

    // sort the snapshots by descending name - this will put the most recent snapshot at the top
    snapshots.sort((b: any, a: any) => {
      return a.name.localeCompare(b.name);
    });

    snapshots.forEach((snapshot: any, index: number) => {
      const snapshotItem = new SnapshotsTreeItem(
        targetID,
        targetName,
        snapshot.id,
        index,
        snapshot.name,
        snapshot.snapshot_type,
        vscode.TreeItemCollapsibleState.None
      );
      snapshotItems.push(snapshotItem);
    });
    return snapshotItems;
  }

  public async snapshotLoad(element: SnapshotsTreeItem) {
    const destDB = ConfigurationSettingService.defaultDstDbUrl;
    const authToken = await SecretStorageService.instance.getAuthToken();

    vscode.window.showInformationMessage("Snapshot Load");
    console.log(
      `Snapshot Load - TargetName: ${element.target_name}, Snapshot Name: ${element.name}, Snapshot Index: ${element.index}, to: ${destDB}`
    );

    var cmdOutput: string;
    cp.exec(
      `DBSNAPPER_DEBUG=true dbsnapper load ${element.target_name} ${element.index} --destdb ${destDB}`,
      // `DBSNAPPER_DEBUG=true dbsnapper targets`,
      (err, stdout, stderr) => {
        cmdOutput = stdout;

        let uri = vscode.Uri.parse("commandTextOutputProvider:" + cmdOutput);
        let doc = vscode.workspace.openTextDocument(uri);
        doc.then((doc) => {
          vscode.window.showTextDocument(doc);
        });

        if (err) {
          console.log("error: " + err);
        }
      }
    );
  }
}
