import { MailCheck } from "@tamagui/lucide-icons";
import { Stack, router } from "expo-router";
import React from "react";
import { Button, Heading, Text, View, XStack, YStack } from "tamagui";
import { translate } from "../../../../../components/translate";

export default function ResetMailSent() {
  return (
    <>
      <Stack.Screen
        options={{
          title: translate.t("auth.resetPasswordSent.screenTitle"),
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
              {translate.t("auth.resetPasswordSent.title")}
            </Heading>
            <Text color="$gray11" textAlign="center">
              {translate.t("auth.resetPasswordSent.description")}
            </Text>
            <Button mt="$4" onPress={() => router.replace("/auth/signin/")}>
              {translate.t("auth.resetPasswordSent.back")}
            </Button>
          </YStack>
        </View>
      </View>
    </>
  );
}
