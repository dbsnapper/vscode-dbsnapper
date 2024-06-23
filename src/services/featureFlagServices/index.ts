import { VSCODE_DBSNAPPER_EXTENSION } from "../../constants";
import { setFeatureFlag } from "../../apis/vscode";

export function disableServiceFeature() {
  // Disable functionality until we validate auth
  setFeatureFlag(VSCODE_DBSNAPPER_EXTENSION.ENABLED_COMMAND_ID, false);
}

export function enableServiceFeature() {
  setFeatureFlag(VSCODE_DBSNAPPER_EXTENSION.ENABLED_COMMAND_ID, true);
}
