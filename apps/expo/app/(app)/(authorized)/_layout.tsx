import { Home, User } from "@tamagui/lucide-icons";
import { Toast, useToastState } from "@tamagui/toast";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { observer } from "mobx-react-lite";
import { View, YStack } from "tamagui";
import { translate } from "../../../components/translate";
import { useColorScheme } from "react-native";
import { AuthStore } from "../../../components/auth/auth.store";
import { AuthProvider } from "../../../components/auth/auth.provider";

const AuthorisedLayout = observer(() => {
  return (
    <>
      <AuthProvider>
        <HomeTabs />
      </AuthProvider>
      <DefaultToast />
    </>
  );
});

const HomeTabs = observer(() => {
  if (!AuthStore.isLoggedIn) {
    return null;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          title: translate.t("home.screenTitle"),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
          title: translate.t("account.screenTitle"),
          headerShown: false,
        }}
      />
    </Tabs>
  );
});

const DefaultToast = () => {
  const currentToast = useToastState();
  const colorScheme = useColorScheme();

  if (!currentToast || currentToast.isHandledNatively) return null;
  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      viewportName={currentToast.viewportName}
      animation={"quick"}
      bg="$backgroundTransparent"
    >
      <View
        overflow="hidden"
        borderRadius={"$4"}
        borderColor={"$gray5"}
        borderWidth="$0.5"
      >
        <BlurView
          intensity={80}
          tint={colorScheme ?? "default"}
          style={{ padding: 8 }}
        >
          <YStack>
            <Toast.Title textAlign="center">{currentToast.title}</Toast.Title>
            {!!currentToast.message && (
              <Toast.Description textAlign="center">
                {currentToast.message}
              </Toast.Description>
            )}
          </YStack>
        </BlurView>
      </View>
    </Toast>
  );
};
export default AuthorisedLayout;
