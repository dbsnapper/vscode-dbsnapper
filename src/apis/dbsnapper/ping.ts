import * as vscode from "vscode";
import axios from "axios";
import { ConfigurationSettingService } from "../../services";
import { SecretStorageService } from "../vscode";

import { StatusBarServiceProvider, setFeatureFlag } from "../vscode";
import { VSCODE_DBSNAPPER_EXTENSION } from "../../constants";
import { createErrorNotification, createInfoNotification } from "../node";

export async function ValidateAuthToken() {
  try {
    await Ping();
  } catch (error) {
    createErrorNotification(error);
  }
}

// Ping
export async function Ping(): Promise<any> {
  const accessToken = await SecretStorageService.instance.getAuthToken();
  const baseUrl = ConfigurationSettingService.baseUrl;
  const endpoint = `${baseUrl}/ping`;
  const headers = {
    Accept: "application/json;odata=verbose",
    "Content-Type": "application/json;odata=verbose",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await axios.get(endpoint, { headers });
    if (response.status === 200) {
      setFeatureFlag(VSCODE_DBSNAPPER_EXTENSION.ENABLED_COMMAND_ID, true);
      createInfoNotification("Ping success");
      StatusBarServiceProvider.instance.showStatusBarInformation(
        "vscode-dbsnapper",
        "- Ready"
      );
      return true;
    }
  } catch (error: any) {
    // vscode.window.showErrorMessage("Failed to fetch data: " + error.message);
    if (error.response) {
      // Request made but the server responded with an error
      if (error.response.status === 401) {
        StatusBarServiceProvider.instance.showStatusBarError(
          "vscode-dbsnapper",
          "- Auth Error"
        );
      }
    } else if (error.request) {
      // Request made but no response is received from the server.
      StatusBarServiceProvider.instance.showStatusBarError(
        "vscode-dbsnapper",
        `- Req Error ${error.message}`
      );
      console.log(error.message);
    } else {
      // Error occured while setting up the request
      StatusBarServiceProvider.instance.showStatusBarError(
        "vscode-dbsnapper",
        "- API Error"
      );
    }
    setFeatureFlag(VSCODE_DBSNAPPER_EXTENSION.ENABLED_COMMAND_ID, false);
  }
}
