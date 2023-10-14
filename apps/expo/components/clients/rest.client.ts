import "react-native-url-polyfill/auto";
import axios, { AxiosInstance } from "axios";
import SuperTokens from "supertokens-react-native";
import { AuthError } from "../auth/auth.error";

class RestClient {
  public readonly API_URL = process.env.EXPO_PUBLIC_API_URL as string;
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
        `${response.config.method?.toUpperCase()} ${response.config.url} - ${
          response.status
        } - ${JSON.stringify(response.data, null, 4).substring(0, 1000)}`
      );
      // supertokens responses with 200 even if the request failed
      if (response.data?.status && response.data.status !== "OK") {
        throw new AuthError(
          response.data.status,
          "formFields" in response.data ? response.data.formFields : undefined
        );
      }
      return response;
    });
  }
}

export const Rest = new RestClient();
