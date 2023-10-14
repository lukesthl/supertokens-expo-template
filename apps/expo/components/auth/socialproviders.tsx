import { YStack, XStack, Separator, Text } from "tamagui";
import { AppleButton } from "./apple.button";
import { GithubButton } from "./github.button";
import { GoogleButton } from "./google.button";

export const SocialProviders = () => (
  <YStack mx="$4" mb="$10" space="$2">
    <XStack space="$4" alignItems="center">
      <Separator />
      <Text color="$gray10" textAlign="center">
        or
      </Text>
      <Separator />
    </XStack>
    <YStack space="$2.5" mt="$3" justifyContent="center">
      <AppleButton />
      <GithubButton />
      <GoogleButton />
    </YStack>
  </YStack>
);
