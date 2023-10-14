import { LmButton } from "@tamagui-extras/core";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { Path, Svg } from "react-native-svg";
import { translate } from "../translate";
import { AuthStore } from "./auth.store";
import { appConfig } from "../../constants/app.config";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID as string;
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${CLIENT_ID}`,
};
export const GithubButton = () => {
  const [loading, setLoading] = React.useState(false);
  const [_request, _response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["read:user", "user:email"],
      redirectUri: makeRedirectUri({
        scheme: appConfig.bundleIdentifier,
      }),
    },
    discovery
  );
  return (
    <LmButton
      loading={loading}
      onPress={async () => {
        setLoading(true);
        try {
          const response = await promptAsync();
          if (response.type === "success") {
            const { code } = response.params;
            await AuthStore.signInWithGithub({ code });
            router.replace("/(app)/(authorized)/home");
          } else {
            console.error(response);
          }
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      }}
      icon={
        <Svg width="16" height="16" viewBox="0 0 24 24">
          <Path
            fill="#fff"
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </Svg>
      }
    >
      {translate.t("auth.login.github")}
    </LmButton>
  );
};
