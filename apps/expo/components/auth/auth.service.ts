import { makeRedirectUri } from "expo-auth-session";
import SuperTokens from "supertokens-react-native";
import { appConfig } from "../../constants/app.config";
import { Rest } from "../clients/rest.client";
import { FormFieldId, IFormField } from "./form/interfaces";

export class AuthService {
  public async getUser() {
    const sessionExists = await SuperTokens.doesSessionExist();
    if (!sessionExists) {
      throw new Error("no session");
    }
    return Rest.client.get<{
      metadata: {
        first_name: string;
        last_name: string;
        email: string;
        avatarUrl?: string;
      };
      roles: string[];
      session: { userId: string; thirdParty?: { id: string; userId: string } };
    }>("/auth/session");
  }

  public async updateUser(formFields: IFormField[]) {
    return Rest.client.patch(`/auth/user`, {
      formFields,
    });
  }

  public async signUp(formFields: IFormField[]) {
    return Rest.client.post<{
      status: "OK" | "FIELD_ERROR" | "GENERAL_ERROR";
    }>(
      "/auth/signup",
      {
        formFields,
      },
      {
        headers: {
          rid: "thirdpartyemailpassword",
        },
      }
    );
  }

  public async signIn(formFields: IFormField[]) {
    return Rest.client.post<
      | {
          status: "OK" | "WRONG_CREDENTIALS_ERROR" | "GENERAL_ERROR";
        }
      | {
          status: "FIELD_ERROR";
          formFields: { error: string; id: FormFieldId }[];
        }
    >("/auth/signin", {
      formFields,
    });
  }

  public async emailExists(email: string) {
    return Rest.client.get<{
      status: "OK" | "GENERAL_ERROR";
      doesExist: boolean;
    }>(`/auth/signup/email/exists?email=${email}`, {
      headers: {
        rid: "thirdpartyemailpassword",
      },
    });
  }

  public async resetPassword(formFields: [IFormField<"email">]) {
    return Rest.client.post<
      | {
          status: "OK" | "GENERAL_ERROR";
        }
      | {
          status: "FIELD_ERROR";
          formFields: { error: string; id: FormFieldId }[];
        }
    >(
      "/auth/user/password/reset/token",
      {
        formFields,
      },
      {
        headers: {
          rid: "thirdpartyemailpassword",
        },
      }
    );
  }

  public async verifyEmail() {
    return Rest.client.post<{
      status: "OK" | "GENERAL_ERROR" | "EMAIL_ALREADY_VERIFIED_ERROR";
    }>("/auth/user/email/verify/token", {
      headers: {
        rid: "emailverification",
      },
    });
  }

  public async signInUp({
    authCode,
    clientType,
    thirdPartyId,
    oAuthTokens,
    user,
  }: {
    authCode?: string;
    thirdPartyId: string;
    clientType: string;
    oAuthTokens?: {
      id_token: string;
    };
    user?: {
      email: string;
      first_name: string;
      last_name: string;
    };
  }) {
    return Rest.client.post(
      `/auth/signinup`,
      {
        redirectURIInfo: !oAuthTokens
          ? {
              redirectURIOnProviderDashboard: makeRedirectUri({
                scheme: appConfig.bundleIdentifier,
              }),
              redirectURIQueryParams: {
                code: authCode,
                user,
              },
            }
          : undefined,
        oAuthTokens,
        thirdPartyId,
        clientType,
      },
      {
        headers: {
          rid: "thirdpartyemailpassword", // This is a temporary workaround, https://github.com/supertokens/supertokens-node/issues/202
        },
      }
    );
  }

  public async signOut() {
    return SuperTokens.signOut();
  }

  public async changePassword({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) {
    return Rest.client.post(`/auth/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  public async changeEmail({ email }: { email: string }) {
    return Rest.client.post(`/auth/change-email`, {
      email,
    });
  }

  public async deleteAccount() {
    return Rest.client.post(`/auth/delete-account`);
  }
}
