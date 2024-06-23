// import { ConfigurationSettingService } from "../../services";
// // import { ClientRequest } from "http";
// // import http = require("https");
// import axios from "axios";
// // import http = require("node:http");
// import { Uri } from "vscode";
// import { createDebugNotification } from "./notificationManager";

// /**
//  * https request class in typesript to show how to manage errors and events
//  * to help prevent ECONNRESET errors
//  */
// export class AxiosOptions {
//   private _requestOptions: axios.AxiosRequestConfig = {};
//   constructor(method: string, authToken: string, baseUrl: string) {
//     const uri = Uri.parse(baseUrl);
//     this._requestOptions = {
//       url: uri.authority,
//       method: method,

//       headers: {
//         Accept: "application/json;odata=verbose",
//         Authorization: authToken,
//         "Content-Type": "application/json;odata=verbose",
//       },
//     };
//   }
//   public async send(data?: any): Promise<any> {
//     let result = "";
//     const promise = new Promise((resolve, reject) => {
//       const req: any = axios(this._requestOptions.url, this._requestOptions) (res) => {
//         res.on("data", (chunk) => {
//           result += chunk;
//         });

//         res.on("error", (err) => {
//           reject(err);
//         });

//         res.on("end", () => {
//           try {
//             let body = result;
//             //there are empty responses

//             if (res.statusCode === 200) {
//               body = JSON.parse(result);
//             }
//             resolve(body);
//           } catch (err) {
//             reject(err);
//           }
//         });
//       });

//       /***
//        * handles the errors on the request
//        */
//       req.on("error", (err) => {
//         reject(err);
//       });

//       /***
//        * handles the timeout error
//        */
//       req.on("timeout", (_err: any) => {
//         req.destroy();
//       });

//       /***
//        * unhandle errors on the request
//        */
//       req.on("uncaughtException", () => {
//         req.destroy();
//       });

//       /**
//        * adds the payload/body
//        */
//       if (data) {
//         const body = JSON.stringify(data);
//         req.write(body);
//       }

//       /**
//        * end the request to prevent ECONNRESETand socket hung errors
//        */
//       req.end(() => {
//         createDebugNotification(`HttpRequest: ${req.method}::${req.host}`);
//       });
//     });

//     return promise;
//   }
// }
