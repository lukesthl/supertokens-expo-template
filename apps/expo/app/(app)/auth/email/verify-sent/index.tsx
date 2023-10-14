import { Stack, router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Button, Heading, Text, View, XStack, YStack } from "tamagui";
import { translate } from "../../../../../components/translate";
import { MailCheck } from "@tamagui/lucide-icons";

export default function EmailVerifySent() {
  const { mail } = useLocalSearchParams<{
    mail: string;
  }>();
  return (
    <>
      <Stack.Screen
        options={{
          title: translate.t("auth.signUpConfirm.screenTitle"),
        }}
      />
      <View mt="$16" space="$3.5" mx="$4" h="100%">
        <View alignItems="center" flexDirection="column">
          <XStack justifyContent="center">
            <View bg="$gray5" borderRadius={"$4"} p="$4">
              <MailCheck size={64} />
            </View>
          </XStack>
          <YStack mt="$4" space="$2" justifyContent="center">
            <Heading textAlign="center">
              {translate.t("auth.signUpConfirm.title")}
            </Heading>
            <Text color="$gray11" textAlign="center">
              {translate.t("auth.signUpConfirm.description", { mail })}
            </Text>
            <Button mt="$4" onPress={() => router.replace("/auth/signin/")}>
              {translate.t("auth.signUpConfirm.back")}
            </Button>
          </YStack>
        </View>
      </View>
    </>
  );
}
