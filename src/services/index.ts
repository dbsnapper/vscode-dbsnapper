import { ExtensionContext } from "vscode";

import { createDebugNotification } from "../apis/node";
import { ValidateAuthToken } from "../apis";

import { registerConfigurationMonitorService } from "./configurationMonitorServices";
import { GlobalStorageService, SecretStorageService } from "../apis/vscode";
import { enableServiceFeature } from "./featureFlagServices";

export { ConfigurationSettingService } from "./configurationServices";

export {
  enableServiceFeature,
  // featureVerifyApiKey,
} from "./featureFlagServices";

export function registerVscodeDBSnapperServices(context: ExtensionContext) {
  //register storage (Singletons)
  createDebugNotification("initialise vscode services");
  SecretStorageService.init(context);
  GlobalStorageService.init(context);

  createDebugNotification("starting storage services");
  registerConfigurationMonitorService(context);

  //load configuration
  createDebugNotification("log configuration service");

  createDebugNotification("verifying service authentication");
  ValidateAuthToken(); //On activation check if the authtoken is valid

  createDebugNotification("verifying enabled features");
  enableServiceFeature();
}
