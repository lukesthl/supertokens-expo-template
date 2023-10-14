import { isAxiosError } from "axios";
import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import { makeAutoObservable } from "mobx";
import { AuthError } from "./auth.error";
import { AuthService } from "./auth.service";

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  thirdParty?: {
    id: string;
    userId: string;
  };
  roles: string[];
}

class AuthStoreSingleton {
  public readonly publicRoutes = ["auth", "missing"];

  private _user: IUser | null = null;
  private _loaded = false;

  constructor(private readonly authService = new AuthService()) {
    makeAutoObservable(this);
  }

  public get loaded(): boolean {
    return this._loaded;
  }

  private set loaded(value: boolean) {
    this._loaded = value;
  }

  private set user(value: IUser | null) {
    this._user = value;
  }

  public async init(): Promise<void> {
    this.loaded = false;
    try {
      await this.loadUser();
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.status);
        console.log(JSON.stringify(error.response?.data, null, 2));
      }
      console.log("session does not exist, redirecting to signin");
    }
    this.loaded = true;
  }

  public async loadUser(): Promise<void> {
    const response = await this.authService.getUser();
    this.user = {
      id: response.data.session.userId,
      firstName: response.data.metadata.first_name,
      lastName: response.data.metadata.last_name,
      email: response.data.metadata.email,
      avatarUrl: response.data.metadata.avatarUrl,
      thirdParty: response.data.session.thirdParty,
      roles: response.data.roles,
    };
  }

  public get user(): IUser {
    if (!this._user) {
      throw new Error("no user");
    }
    return this._user;
  }

  public get isLoggedIn(): boolean {
    return !!this._user;
  }

  public async signIn(formData: { email: string; password: string }) {
    const response = await this.authService.signIn([
      {
        id: "email",
        value: formData.email,
      },
      {
        id: "password",
        value: formData.password,
      },
    ]);
    try {
      await this.loadUser();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 403) {
        throw new AuthError("USER_NOT_CONFIRMED_ERROR");
      }
    }
    return response.data;
  }

  public async signInWithApple() {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (credential.authorizationCode) {
      await this.authService.signInUp({
        thirdPartyId: "apple",
        authCode: credential.authorizationCode,
        clientType: "service",
        user: {
          email: credential.email ?? "",
          first_name: credential.fullName?.givenName ?? "",
          last_name: credential.fullName?.familyName ?? "",
        },
      });
      await this.loadUser();
    } else {
      throw new Error("No authorizationCode");
    }
  }

  public async signInWithGithub({ code }: { code: string }) {
    await this.authService.signInUp({
      thirdPartyId: "github",
      authCode: code,
      clientType: "ios",
    });
    await this.loadUser();
  }

  public async signInWithGoogle({ idToken }: { idToken: string }) {
    await this.authService.signInUp({
      thirdPartyId: "google",
      oAuthTokens: {
        id_token: idToken,
      },
      clientType: "ios",
    });
    await this.loadUser();
  }

  public async signUp(formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const response = await this.authService.signUp([
      {
        id: "email",
        value: formData.email,
      },
      {
        id: "first_name",
        value: formData.firstName,
      },
      {
        id: "last_name",
        value: formData.lastName,
      },
      {
        id: "password",
        value: formData.password,
      },
    ]);
    return response.data;
  }

  public async signOut() {
    router.replace("/auth/signin/");
    await this.authService.signOut();
    this.user = null;
  }

  public async resetPassword({ email }: { email: string }) {
    const response = await this.authService.resetPassword([
      { id: "email", value: email },
    ]);
    if (response.data.status === "FIELD_ERROR") {
      throw new AuthError(response.data.status, response.data.formFields);
    }
  }

  public async verifyEmail() {
    await this.authService.verifyEmail();
  }

  public async changePassword({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) {
    const response = await this.authService.changePassword({
      oldPassword,
      newPassword,
    });
    if (response.data.status !== "OK") {
      throw new AuthError(response.data.status, response.data.formFields);
    }
  }

  public async changeEmail({ email }: { email: string }) {
    const response = await this.authService.changeEmail({
      email,
    });
    if (response.data.status !== "OK") {
      throw new AuthError(response.data.status, response.data.formFields);
    }
  }

  public async updateUser({
    firstName,
    lastName,
    avatarUrl,
  }: {
    firstName: string;
    lastName: string;
    avatarUrl: string;
  }) {
    const response = await this.authService.updateUser([
      {
        id: "first_name",
        value: firstName,
      },
      {
        id: "last_name",
        value: lastName,
      },
      {
        id: "avatarUrl",
        value: avatarUrl,
      },
    ]);
    return response;
  }

  public async deleteAccount() {
    const response = await this.authService.deleteAccount();
    if (response.data.status !== "OK") {
      throw new AuthError(response.data.status, response.data.formFields);
    }
  }
}

export const AuthStore = new AuthStoreSingleton();
