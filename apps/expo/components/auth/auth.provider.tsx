import { Slot, Stack, router, useSegments } from "expo-router";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { View } from "tamagui";
import { AuthStore } from "./auth.store";

export const AuthProvider = observer(
  ({ children }: { children: JSX.Element }) => {
    const segments = useSegments();
    console.log(`Navigated to ${segments.join("/")}`);
    const publicRoute =
      AuthStore.publicRoutes.some((publicRoute) =>
        (segments as string[]).includes(publicRoute)
      ) || segments.length === 0;
    useEffect(() => {
      if (!AuthStore.loaded) {
        void AuthStore.init().then(() => {
          // needs to be called after the router is initialized
          if (AuthStore.isLoggedIn && publicRoute) {
            router.replace("/(app)/(authorized)/home");
          } else if (!AuthStore.isLoggedIn) {
            router.replace("/auth/signin");
          }
        });
      }
    }, []);
    return AuthStore.loaded && (AuthStore.isLoggedIn || publicRoute) ? (
      children
    ) : (
      <View flex={1} justifyContent="center">
        <ActivityIndicator size="large" />
      </View>
    );
  }
);
