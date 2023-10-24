import { Slot } from "expo-router";

import { AuthProvider } from "../../../components/auth/auth.provider";

export const unstable_settings = {
  initialRouteName: "/",
};

export function RootLayoutNav() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
