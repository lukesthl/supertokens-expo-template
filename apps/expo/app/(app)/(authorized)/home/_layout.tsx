import { Stack } from "expo-router";
import { observer } from "mobx-react-lite";

export const unstable_settings = {
  initialRouteName: "index",
};

const AuthorisedLayout = observer(() => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
});

export default AuthorisedLayout;
