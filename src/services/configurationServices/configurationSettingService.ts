import { extensions, version, env, UIKind } from "vscode";
import CryptoJS from "crypto-js";
import {
  SecretStorageService,
  StatusBarServiceProvider,
} from "../../apis/vscode";
import {
  createErrorNotification,
  createInfoNotification,
  waitFor,
} from "../../apis/node";
import ConfigurationService from "./configurationService";
import { IConfigurationSetting, IDynamicLooseObject } from "../../types";

type ApiHeader = {
  name: string;
  value: string;
};

class ConfigurationSettingService
  extends ConfigurationService
  implements IConfigurationSetting
{
  private static instance: ConfigurationSettingService | null = null;

  private constructor() {
    super();
  }

  public static getInstance(): ConfigurationSettingService {
    if (!ConfigurationSettingService.instance) {
      ConfigurationSettingService.instance = new ConfigurationSettingService();
    }
    return ConfigurationSettingService.instance;
  }

  static async loadConfigurationService({
    defaultDstDbUrl,
    baseUrl,
  }: {
    defaultDstDbUrl: string;
    baseUrl: string;
  }) {
    StatusBarServiceProvider.instance.showStatusBarInformation(
      "vscode-dbsnapper",
      "update-setting-configuration"
    );
    if (this.instance) {
      this.instance.defaultDstDbUrl = defaultDstDbUrl;
      this.instance.baseUrl = baseUrl;
      //Force wait as we need the config to be written
      await waitFor(500, () => false);
      StatusBarServiceProvider.instance.showStatusBarInformation(
        "vscode-dbsnapper",
        ""
      );
    }
  }

  // defaultDstDbUrl GETTER AND SETTER
  // defaultDstDbUrl is the default destination database
  public get defaultDstDbUrl(): string {
    return this.getConfigValue<string>("defaultDstDbUrl");
  }
  public set defaultDstDbUrl(value: string | undefined) {
    this.setConfigValue<string | undefined>("defaultDstDbUrl", value);
  }
  // baseUrl GETTER AND SETTER
  public get baseUrl(): string {
    return this.getConfigValue<string>("baseUrl");
  }
  public set baseUrl(value: string | undefined) {
    this.setConfigValue<string | undefined>("baseUrl", value);
  }

  // host used for display bar
  public get host(): string {
    return "app.dbsnapper.com";
  }

  // API HEADERS for http client
  // public get apiHeaders(): IDynamicLooseObject {
  //   const apiHeaders = this.getConfigValue<Array<ApiHeader>>(
  //     "conversation-configuration.api-headers"
  //   );
  //   const headers: IDynamicLooseObject = {};

  //   apiHeaders.forEach((apiHeader) => {
  //     headers[apiHeader.name] = apiHeader.value;
  //   });
  //   return headers;
  // }

  public async getRequestConfig(): Promise<any> {
    return {
      headers: {
        Authentication: (await this.getAuthToken()) as string,
      },
    };
  }

  public async getAuthToken(): Promise<string> {
    var token = await SecretStorageService.instance.getAuthToken();
    return "Bearer " + token;
  }

  // vscode and extension specific
  public get vscodeVersion(): string {
    return version;
  }

  public get vscodeUiKind(): string {
    switch (env.uiKind) {
      case UIKind.Desktop:
        return "desktop";
      case UIKind.Web:
        return "web";
      default:
        return "unknown";
    }
  }

  public get vscodeLanguage(): string {
    return env.language;
  }
  public get extensionVersion(): string {
    try {
      const extension = extensions.getExtension(
        "dbsnapper.vscode-dbsnapper"
      )?.packageJSON;
      return extension.version ? extension.version.toString() : "beta";
    } catch (error) {
      createErrorNotification(error);
    }
    return "";
  }

  public ResetConfigurationService(): void {
    this.defaultDstDbUrl = undefined;
  }

  public LogConfigurationService(): void {
    try {
      const cfgMap = new Map<string, string>();
      cfgMap.set("vscode_version", this.vscodeVersion);
      cfgMap.set("vscode_ui_kind", this.vscodeUiKind);
      cfgMap.set("vscode_language", this.vscodeLanguage);
      cfgMap.set("extension_version", this.extensionVersion);
      cfgMap.set("default_dstdb_url", this.defaultDstDbUrl);
      cfgMap.set("base_url", this.baseUrl);

      createInfoNotification(
        Object.fromEntries(cfgMap),
        "setting_configuration"
      );
    } catch (error) {
      createErrorNotification(error);
    }
  }
}

export default ConfigurationSettingService.getInstance();
