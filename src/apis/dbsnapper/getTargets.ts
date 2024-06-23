import * as vscode from "vscode";
import axios from "axios";
import { ConfigurationSettingService } from "../../services";
import { SecretStorageService } from "../vscode";
import { createErrorNotification, createInfoNotification } from "../node";

// Get Targets
export async function GetTargets(): Promise<any> {
  const accessToken = await SecretStorageService.instance.getAuthToken();
  const baseUrl = ConfigurationSettingService.baseUrl;
  const endpoint = `${baseUrl}/targets`;
  const headers = {
    Accept: "application/json;odata=verbose",
    "Content-Type": "application/json;odata=verbose",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await axios.get(endpoint, { headers });
    if (response.status === 200) {
      createInfoNotification("Get Targets success");
      console.log(response);
      return response.data;
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      "Failed to fetch data: " + (error as Error).message
    );
  }
}
