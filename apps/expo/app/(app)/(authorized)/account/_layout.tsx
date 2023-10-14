import { Stack } from "expo-router";
import { observer } from "mobx-react-lite";
import { translate } from "../../../../components/translate";

export const unstable_settings = {
  initialRouteName: "index",
};

const AuthorisedLayout = observer(() => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="delete-account/modal"
        options={{
          title: translate.t("account.deleteaccount.screenTitle"),
          presentation: "modal",
        }}
      />
    </Stack>
  );
});

export default AuthorisedLayout;
