import * as vscode from "vscode";
export class CommandTextOutputProvider
  implements vscode.TextDocumentContentProvider
{
  public provideTextDocumentContent(
    uri: vscode.Uri,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<string> {
    return uri.path;
  }
}
