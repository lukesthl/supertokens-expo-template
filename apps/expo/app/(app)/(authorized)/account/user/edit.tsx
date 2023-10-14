import { LmButton } from "@tamagui-extras/core";
import { Upload, X } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Heading, Image, Input, Text, View, XStack, YStack } from "tamagui";
import { AuthStore } from "../../../../../components/auth/auth.store";
import { translate } from "../../../../../components/translate";
import {
  DismissKeyboard,
  useSoftKeyboardEffect,
} from "../../../../../components/keyboard";

const EditUser = observer(() => {
  const toast = useToastController();
  useSoftKeyboardEffect();
  return (
    <>
      <Stack.Screen
        options={{
          title: translate.t("account.edituser.screenTitle"),
        }}
      />

      <DismissKeyboard>
        <Formik
          initialValues={{
            firstName: AuthStore.user.firstName,
            lastName: AuthStore.user.lastName,
            avatarUrl: AuthStore.user.avatarUrl,
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validate={(values) => {
            const errors: Record<string, string> = {};
            if (!values.firstName) {
              errors.firstName = translate.t(
                "account.edituser.errors.firstname.required"
              );
            } else if (!values.lastName) {
              errors.lastName = translate.t(
                "account.edituser.errors.lastname.required"
              );
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await AuthStore.updateUser({
                firstName: values.firstName,
                lastName: values.lastName,
                avatarUrl: values.avatarUrl || "",
              });
              await AuthStore.loadUser();
              toast.show(translate.t("account.edituser.success"), {
                type: "success",
              });
              router.back();
            } catch (error) {
              setErrors({
                firstName: translate.t("account.edituser.errors.unknown"),
              });
              console.log(error);
            }
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => (
            <View mt="$8" space="$3.5" mx="$4">
              <View>
                <Text>{translate.t("account.edituser.subHeadline")}</Text>
                <Heading>{translate.t("account.edituser.title")}</Heading>
              </View>
              <YStack space="$3">
                <YStack space="$1.5">
                  <Text>{translate.t("account.edituser.avatarurl")}</Text>
                  <View
                    borderRadius={"$3"}
                    bg="$gray1"
                    h="$10"
                    w="50%"
                    position="relative"
                    onPress={async () => {
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 0.1,
                        base64: true,
                      });

                      if (!result.canceled) {
                        setFieldValue(
                          "avatarUrl",
                          `data:image/jpeg;base64,${result.assets[0].base64}`
                        );
                      }
                    }}
                    pressStyle={{ bg: "$gray3" }}
                    borderColor="$gray10"
                    borderWidth="$0.5"
                    borderStyle="dashed"
                    p="$1.5"
                  >
                    {values.avatarUrl ? (
                      <>
                        <View
                          borderRadius="$10"
                          overflow="hidden"
                          position="absolute"
                          right={"$-2.5"}
                          bg={"$gray5"}
                          top={"$-2.5"}
                          zIndex={2}
                          p="$1.5"
                          onPress={() => {
                            setFieldValue("avatarUrl", "");
                          }}
                          pressStyle={{ bg: "$gray3" }}
                        >
                          <X size="$1" color="$gray12" />
                        </View>
                        <Image
                          source={{
                            uri: values.avatarUrl,
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          resizeMode={"cover"}
                          borderRadius="$2"
                        />
                      </>
                    ) : (
                      <XStack
                        h="100%"
                        space="$3"
                        justifyContent="center"
                        alignItems="center"
                        p="$3"
                      >
                        <Upload size="$1" color="$gray10" />
                        <Text
                          color="$gray12"
                          fontSize={"$3"}
                          textAlign="center"
                        >
                          {translate.t("account.edituser.uploadavatarurl")}
                        </Text>
                      </XStack>
                    )}
                  </View>
                </YStack>
                <XStack space="$2">
                  <Input
                    placeholder={translate.t("account.edituser.firstname")}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    value={values.firstName}
                    autoCapitalize="words"
                    theme={errors.firstName ? "red" : undefined}
                    borderColor={errors.firstName ? "$red8" : undefined}
                    flex={1}
                  />
                  <Input
                    placeholder={translate.t("account.edituser.lastname")}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    value={values.lastName}
                    autoCapitalize="words"
                    theme={errors.lastName ? "red" : undefined}
                    borderColor={errors.lastName ? "$red8" : undefined}
                    flex={1}
                  />
                </XStack>
              </YStack>
              {(errors.firstName || errors.lastName) && (
                <Text color="$red10">
                  {errors.firstName || errors.lastName}
                </Text>
              )}
              <View>
                <LmButton onPress={() => handleSubmit()} loading={isSubmitting}>
                  {translate.t("account.edituser.submit")}
                </LmButton>
              </View>
            </View>
          )}
        </Formik>
      </DismissKeyboard>
    </>
  );
});

export default EditUser;
