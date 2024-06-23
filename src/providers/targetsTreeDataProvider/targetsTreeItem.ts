import * as vscode from "vscode";
import * as path from "path";

export class TargetsTreeItem extends vscode.TreeItem {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(name, collapsibleState);
    this.contextValue = "target"; // for "when" clause in view/item/context
    // this.tooltip = `${this.label}`;
    // this.description = this.label;
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
