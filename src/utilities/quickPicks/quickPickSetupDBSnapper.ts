/**
 * This function runs a multistep configuration for vscode-dbsnapper
 * 	Steps:
 * 		1 - AuthToken
 * 		2 - Default destination database URL
 * 		Store and activate configuration
 */

import { QuickPickItem, ExtensionContext, Uri } from "vscode";
import { ConfigurationSettingService } from "../../services";
import { SecretStorageService, MultiStepInput } from "../../apis/vscode";

/**
 * This function sets up a quick pick menu for configuring the DBSnapper service provider.
 * @param _context - The extension context.
 * @returns void
 */
export async function quickPickSetupDBSnapper(
  _context: ExtensionContext
): Promise<void> {
  interface State {
    title: string;
    step: number;
    totalSteps: number;
    dbsnapperAuthToken: string;
    dbsnapperDefaultDbUrl: string;
  }

  async function collectInputs() {
    const state = {} as Partial<State>;
    await MultiStepInput.run((input) => inputDBSnapperAuthToken(input, state));
    return state as State;
  }

  const title = "Configure DBSnapper Cloud";

  /**
   * This function collects user input for the DBSnapper Authtoken and returns it as a state object.
   * @param input - The multi-step input object.
   * @param state - The current state of the application.
   * @returns A function that that prompts for default destination database url.
   */
  async function inputDBSnapperAuthToken(
    input: MultiStepInput,
    state: Partial<State>
  ) {
    state.dbsnapperAuthToken = await input.showInputBox({
      title,
      step: 1,
      totalSteps: 2,
      ignoreFocusOut: true,
      value:
        typeof state.dbsnapperAuthToken === "string"
          ? state.dbsnapperAuthToken
          : "",
      prompt: `$(key)  Enter your DBSnapper Authtoken`,
      placeholder: "<DBSnapper Authtoken>",
      validate: validateDBSnapperAuthToken,
      shouldResume: shouldResume,
    });
    return (input: MultiStepInput) => inputDefaultDstDbUrl(input, state);
  }

  /**
   * This function collects user input for the service baseurl and returns it as a state object.
   * @param input - The multi-step input object.
   * @param state - The current state of the application.
   * @returns
   */
  async function inputDefaultDstDbUrl(
    input: MultiStepInput,
    state: Partial<State>
  ) {
    state.dbsnapperDefaultDbUrl = await input.showInputBox({
      title,
      step: 2,
      totalSteps: 2,
      ignoreFocusOut: true,
      value:
        typeof state.dbsnapperDefaultDbUrl === "string"
          ? state.dbsnapperDefaultDbUrl
          : "postgres://postgres:postgres@localhost:5432/dbsnapper_default",
      valueSelection:
        typeof state.dbsnapperDefaultDbUrl === "string" ? undefined : [0, 61],
      prompt:
        "$(globe)  Enter the default destination database URL - will be overwritten on loads",
      placeholder:
        "postgres://postgres:postgres@localhost:5432/dbsnapper_default",
      validate: validateDBSnapperDefaultDbUrl,
      shouldResume: shouldResume,
    });
  }

  /**
   * This function validates whether an API key is valid or not based on its length and prefix.
   * @param name - The name of the API key to be validated.
   * @returns An error message if validation fails or undefined if validation passes.
   */
  async function validateDBSnapperAuthToken(
    name: string
  ): Promise<string | undefined> {
    const APIKEY_MIN_LENGTH = 1;

    // At least 1 character
    return name.length >= APIKEY_MIN_LENGTH
      ? undefined
      : "Invalid DBSnapper Authtoken";
  }

  /**
   * This function validates whether an instance name is valid or not based on resolving the host.
   * @param name - The name of the API key to be validated.
   * @returns An error message if validation fails or undefined if validation passes.
   */
  async function validateDBSnapperDefaultDbUrl(
    dbUrl: string
  ): Promise<string | undefined> {
    return Uri.parse(dbUrl) ? undefined : "Invalid Uri";
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((_resolve, _reject) => {
      /* noop */
    });
  }

  function cleanQuickPick(label: string) {
    return label.replace(`$(symbol-function)  `, "");
  }

  // Set DBSnapper configuration
  const state = await collectInputs();

  await SecretStorageService.instance.setAuthToken(state.dbsnapperAuthToken);
  ConfigurationSettingService.defaultDstDbUrl = state.dbsnapperDefaultDbUrl;
}
