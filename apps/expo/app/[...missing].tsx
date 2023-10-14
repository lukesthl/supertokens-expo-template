import { Link, Stack, useSegments } from "expo-router";
import { Button, Heading, View } from "tamagui";
import { AuthStore } from "../components/auth/auth.store";
import { translate } from "../components/translate";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: translate.t("notFound.screenTitle") }} />
      <View mt="$8" space="$3.5" mx="$4">
        <View>
          <Heading>{translate.t("notFound.description")}</Heading>
        </View>
        <Link href={AuthStore.isLoggedIn ? "/home" : "/auth/signin/"} asChild>
          <Button>{translate.t("notFound.back")}</Button>
        </Link>
      </View>
    </>
  );
}
