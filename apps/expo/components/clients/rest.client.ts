import "react-native-url-polyfill/auto";

import type { AxiosInstance } from "axios";
import axios from "axios";
import SuperTokens from "supertokens-react-native";

import type { AuthErrorType } from "../auth/auth.error";
import { AuthError } from "../auth/auth.error";
import type { FormFieldId } from "../auth/form/interfaces";

class RestClient {
  public readonly API_URL = process.env.EXPO_PUBLIC_API_URL!;
  public client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: this.API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    SuperTokens.addAxiosInterceptors(this.client);
    this.client.interceptors.response.use((response) => {
      console.log(
        `${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} - ${JSON.stringify(
          response.data,
          null,
          4
        ).substring(0, 1000)}`
      );
      // supertokens responses with 200 even if the request failed
      const supertokensError = response.data as {
        status?: AuthErrorType | "OK";
        formFields?: { error: string; id: FormFieldId }[];
      };
      if (supertokensError.status && supertokensError.status !== "OK") {
        throw new AuthError(
          supertokensError.status,
          "formFields" in supertokensError ? supertokensError.formFields : undefined
        );
      }
      return response;
    });
  }
}

export const Rest = new RestClient();
