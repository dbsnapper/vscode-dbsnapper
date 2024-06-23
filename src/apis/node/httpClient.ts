import { ConfigurationSettingService } from "../../services";
import { ClientRequest } from "http";
// import http = require("https");
import http = require("node:http");
import { Uri } from "vscode";
import { createDebugNotification } from "./notificationManager";

/**
 * https request class in typesript to show how to manage errors and events
 * to help prevent ECONNRESET errors
 */
export class HttpRequest {
  private _requestOptions: http.RequestOptions = {};
  constructor(method: string, authToken: string, baseUrl: string) {
    const uri = Uri.parse(baseUrl);
    this._requestOptions = {
      hostname: uri.authority,
      method: method,
      path: `${uri.path}?${uri.query}`,
      port: 443,
      headers: {
        Accept: "application/json;odata=verbose",
        Authorization: authToken,
        "Content-Type": "application/json;odata=verbose",
      },
    };
    if (
      baseUrl.includes("localhost") ||
      baseUrl.includes("home.arpa") ||
      baseUrl.includes("local")
    ) {
      this._requestOptions.port = 3000;
    }
  }
  public async send(data?: any): Promise<any> {
    let result = "";
    const promise = new Promise((resolve, reject) => {
      const req: ClientRequest = http.request(this._requestOptions, (res) => {
        res.on("data", (chunk) => {
          result += chunk;
        });

        res.on("error", (err) => {
          reject(err);
        });

        res.on("end", () => {
          try {
            let body = result;
            //there are empty responses

            if (res.statusCode === 200) {
              body = JSON.parse(result);
            }
            resolve(body);
          } catch (err) {
            reject(err);
          }
        });
      });

      /***
       * handles the errors on the request
       */
      req.on("error", (err) => {
        reject(err);
      });

      /***
       * handles the timeout error
       */
      req.on("timeout", (_err: any) => {
        req.destroy();
      });

      /***
       * unhandle errors on the request
       */
      req.on("uncaughtException", () => {
        req.destroy();
      });

      /**
       * adds the payload/body
       */
      if (data) {
        const body = JSON.stringify(data);
        req.write(body);
      }

      /**
       * end the request to prevent ECONNRESETand socket hung errors
       */
      req.end(() => {
        createDebugNotification(`HttpRequest: ${req.method}::${req.host}`);
      });
    });

    return promise;
  }
}
