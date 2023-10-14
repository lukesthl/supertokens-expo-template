import { Stack } from "expo-router";
import { AuthProvider } from "../../../components/auth/auth.provider";
import { Slot } from "expo-router";

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
