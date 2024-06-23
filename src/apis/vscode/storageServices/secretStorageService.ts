import { ExtensionContext, SecretStorage } from "vscode";
import { createErrorNotification } from "../../node";
import { ValidateAuthToken } from "../../../apis";

export default class SecretStorageService {
  private static _instance: SecretStorageService;

  constructor(private secretStorage: SecretStorage) {}

  static init(context: ExtensionContext): void {
    try {
      SecretStorageService._instance = new SecretStorageService(
        context.secrets
      );
    } catch (error) {
      createErrorNotification(error);
    }
  }

  static get instance(): SecretStorageService {
    return SecretStorageService._instance;
  }

  async setAuthToken(token: string): Promise<void> {
    await this.secretStorage.store("dbsnapper_authtoken", token);
    ValidateAuthToken();
  }

  async getAuthToken(): Promise<string | undefined> {
    return await this.secretStorage.get("dbsnapper_authtoken");
  }
}
