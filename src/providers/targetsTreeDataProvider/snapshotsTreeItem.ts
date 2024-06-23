import * as vscode from "vscode";
import * as path from "path";

export class SnapshotsTreeItem extends vscode.TreeItem {
  constructor(
    public readonly target_id: string,
    public readonly target_name: string,
    public readonly id: string,
    public readonly index: number,
    public readonly name: string,
    public readonly type: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(name, collapsibleState);
    this.contextValue = "snapshot"; // for "when" clause in view/item/context
    // this.tooltip = `${this.label}`;
    this.description = `${this.type} snapshot`;
  }
  iconPath = {
    light: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "light",
      "dependency.svg"
    ),
    dark: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "dark",
      "dependency.svg"
    ),
  };
}
