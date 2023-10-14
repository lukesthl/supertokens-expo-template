import { LmButton } from "@tamagui-extras/core";
import { useState } from "react";
import { Path, Svg } from "react-native-svg";
import { translate } from "../translate";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AuthStore } from "./auth.store";
import { router } from "expo-router";

GoogleSignin.configure();

export const GoogleButton = () => {
  const [loading, setLoading] = useState(false);

  return (
    <LmButton
      icon={
        <Svg viewBox="0 0 24 24" width="16" height="16">
          <Path
            fill="#fff"
            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
          />
        </Svg>
      }
      loading={loading}
      onPress={async () => {
        setLoading(true);
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          if (userInfo.idToken) {
            await AuthStore.signInWithGoogle({
              idToken: userInfo.idToken,
            });
            router.replace("/(app)/(authorized)/home");
          }
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      }}
    >
      {translate.t("auth.login.google")}
    </LmButton>
  );
};
