import { useState } from "react";
import { Linking, Platform, RefreshControl, useColorScheme } from "react-native";
import { Link, router, Stack } from "expo-router";
import {
  AlertTriangle,
  Building2,
  ChevronRight,
  FileText,
  Lock,
  LogOut,
  Mail,
  Settings2,
  ShieldCheck,
  User,
  User2,
} from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { observer } from "mobx-react-lite";
import { Avatar, getTokens, H4, Heading, ListItem, ScrollView, Separator, View, YGroup, YStack } from "tamagui";

import { AuthStore } from "../../../../components/auth/auth.store";
import { translate } from "../../../../components/translate";
import { appConfig } from "../../../../constants/app.config";

const Account = observer(() => {
  const toast = useToastController();
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  const onRefresh = () => {
    setRefreshing(true);
    void AuthStore.loadUser().then(() => {
      setRefreshing(false);
    });
  };
  return (
    <>
      <Stack.Screen options={{ title: translate.t("account.screenTitle") }} />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View marginVertical="$4" space="$3.5" marginHorizontal="$4">
          <YStack alignItems="center" space="$2">
            <Avatar circular size="$8">
              {AuthStore.user.avatarUrl && <Avatar.Image src={AuthStore.user.avatarUrl} />}
              <Avatar.Fallback backgroundColor="$gray6" alignItems="center" justifyContent="center">
                <User2 size="$4" />
              </Avatar.Fallback>
            </Avatar>
            <Heading>
              {AuthStore.user.firstName} {AuthStore.user.lastName}
            </Heading>
          </YStack>
          <YGroup alignSelf="center" bordered size="$5" separator={<Separator />}>
            <YGroup.Item>
              <ListItem
                hoverTheme
                pressTheme
                onPress={() => router.push("/account/user/edit")}
                title={translate.t("account.general.user.title")}
                subTitle={translate.t("account.general.user.description")}
                icon={
                  <View backgroundColor="$gray5" borderRadius={"$3"} padding="$2">
                    <User />
                  </View>
                }
                iconAfter={ChevronRight}
              />
            </YGroup.Item>
            <YGroup.Item>
              <ListItem
                hoverTheme
                pressTheme
                opacity={AuthStore.user.thirdParty.length > 0 ? 0.65 : 1}
                onPress={() => {
                  if (AuthStore.user.thirdParty.length > 0) {
                    toast.show(translate.t("account.general.email.thirdpartyinfo.title"), {
                      message: translate.t("account.general.email.thirdpartyinfo.description"),
                    });
                  } else {
                    router.push("/account/email/change");
                  }
                }}
                title={translate.t("account.general.email.title")}
                subTitle={translate.t("account.general.email.description")}
                icon={
                  <View backgroundColor="$gray5" borderRadius={"$3"} padding="$2">
                    <Mail />
                  </View>
                }
                iconAfter={ChevronRight}
              />
            </YGroup.Item>
            <YGroup.Item>
              <ListItem
                hoverTheme
                pressTheme
                opacity={AuthStore.user.thirdParty.length > 0 ? 0.65 : 1}
                onPress={() => {
                  if (AuthStore.user.thirdParty.length > 0) {
                    toast.show(translate.t("account.general.password.thirdpartyinfo.title"), {
                      message: translate.t("account.general.password.thirdpartyinfo.description"),
                    });
                  } else {
                    router.push("/account/password/change");
                  }
                }}
                title={translate.t("account.general.password.title")}
                subTitle={translate.t("account.general.password.description")}
                icon={
                  <View backgroundColor="$gray5" borderRadius={"$3"} padding="$2">
                    <Lock />
                  </View>
                }
                iconAfter={ChevronRight}
              />
            </YGroup.Item>
            <YGroup.Item>
              <ListItem
                hoverTheme
                pressTheme
                onPress={() => {
                  if (Platform.OS === "ios") {
                    void Linking.openURL("app-settings:");
                  } else {
                    void Linking.openSettings();
                  }
                }}
                title={translate.t("account.general.settings.title")}
                subTitle={translate.t("account.general.settings.description")}
                icon={
                  <View backgroundColor="$gray5" borderRadius={"$3"} padding="$2">
                    <Settings2 />
                  </View>
                }
                iconAfter={ChevronRight}
              />
            </YGroup.Item>
          </YGroup>
          <H4>{translate.t("account.legal.title")}</H4>
          <YGroup alignSelf="center" bordered size="$5" separator={<Separator />}>
            <YGroup.Item>
              <Link href={appConfig.privacyPolicyUrl} asChild>
                <ListItem
                  hoverTheme
                  pressTheme
                  icon={
                    <View backgroundColor="$gray5" borderRadius={"$3"} padding="$2">
                      <ShieldCheck />
                    </View>
                  }
                  iconAfter={ChevronRight}
                >
                  <ListItem.Text>{translate.t("account.legal.privacypolicy.title")}</ListItem.Text>
                </ListItem>
              </Link>
            </YGroup.Item>
            <YGroup.Item>
              <ListItem
                hoverTheme
                pressTheme
                icon={
                  <View backgroundColor="$gray5" borderRadius={"$3"} padding="$2">
                    <FileText />
                  </View>
                }
                iconAfter={ChevronRight}
              >
                <ListItem.Text>{translate.t("account.legal.termsandconditions.title")}</ListItem.Text>
              </ListItem>
            </YGroup.Item>
            <YGroup.Item>
              <Link href={appConfig.imprintUrl} asChild>
                <ListItem
                  hoverTheme
                  pressTheme
                  icon={
                    <View backgroundColor="$gray5" borderRadius={"$3"} padding="$2">
                      <Building2 />
                    </View>
                  }
                  iconAfter={ChevronRight}
                >
                  <ListItem.Text>{translate.t("account.legal.imprint.title")}</ListItem.Text>
                </ListItem>
              </Link>
            </YGroup.Item>
          </YGroup>
          <YGroup alignSelf="center" bordered size="$5" separator={<Separator />}>
            <YGroup.Item>
              <ListItem
                hoverTheme
                pressTheme
                icon={
                  <View backgroundColor="$red5" borderRadius={"$3"} padding="$2">
                    <LogOut color={(getTokens().color?.red10Dark as { val: string })?.val} />
                  </View>
                }
                onPress={() => {
                  void AuthStore.signOut();
                }}
                iconAfter={ChevronRight}
              >
                <ListItem.Text>{translate.t("account.logout")}</ListItem.Text>
              </ListItem>
            </YGroup.Item>
            <YGroup.Item>
              <Link href={"/(app)/(authorized)/account/delete-account/modal"} asChild>
                <ListItem
                  hoverTheme
                  pressTheme
                  icon={
                    <View
                      backgroundColor={colorScheme === "light" ? "$yellow4" : "$gray5"}
                      borderRadius={"$3"}
                      padding="$2"
                    >
                      <AlertTriangle color={"$yellow11"} />
                    </View>
                  }
                  iconAfter={ChevronRight}
                >
                  <ListItem.Text>{translate.t("account.deleteaccount.title")}</ListItem.Text>
                </ListItem>
              </Link>
            </YGroup.Item>
          </YGroup>
        </View>
      </ScrollView>
    </>
  );
});

export default Account;
