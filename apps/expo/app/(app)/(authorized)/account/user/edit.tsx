import React from "react";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import { LmButton } from "@tamagui-extras/core";
import { Upload, X } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Heading, Image, Input, Text, View, XStack, YStack } from "tamagui";

import { AuthStore } from "../../../../../components/auth/auth.store";
import { DismissKeyboard, useSoftKeyboardEffect } from "../../../../../components/keyboard";
import { translate } from "../../../../../components/translate";

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
              errors.firstName = translate.t("account.edituser.errors.firstname.required");
            } else if (!values.lastName) {
              errors.lastName = translate.t("account.edituser.errors.lastname.required");
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await AuthStore.updateUser({
                firstName: values.firstName,
                lastName: values.lastName,
                avatarUrl: values.avatarUrl ?? "",
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
          {({ values, errors, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
            <View marginTop="$8" space="$3.5" marginHorizontal="$4">
              <View>
                <Text>{translate.t("account.edituser.subHeadline")}</Text>
                <Heading>{translate.t("account.edituser.title")}</Heading>
              </View>
              <YStack space="$3">
                <YStack space="$1.5">
                  <Text>{translate.t("account.edituser.avatarurl")}</Text>
                  <View
                    borderRadius={"$3"}
                    backgroundColor="$gray1"
                    height="$10"
                    width="50%"
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
                        void setFieldValue("avatarUrl", `data:image/jpeg;base64,${result.assets[0]?.base64}`);
                      }
                    }}
                    pressStyle={{ backgroundColor: "$gray3" }}
                    borderColor="$gray10"
                    borderWidth="$0.5"
                    borderStyle="dashed"
                    padding="$1.5"
                  >
                    {values.avatarUrl ? (
                      <>
                        <View
                          borderRadius="$10"
                          overflow="hidden"
                          position="absolute"
                          right={"$-2.5"}
                          backgroundColor={"$gray5"}
                          top={"$-2.5"}
                          zIndex={2}
                          padding="$1.5"
                          onPress={() => {
                            void setFieldValue("avatarUrl", "");
                          }}
                          pressStyle={{ backgroundColor: "$gray3" }}
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
                      <XStack height="100%" space="$3" justifyContent="center" alignItems="center" padding="$3">
                        <Upload size="$1" color="$gray10" />
                        <Text color="$gray12" fontSize={"$3"} textAlign="center">
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
              {(errors.firstName ?? errors.lastName) && (
                <Text color="$red10">{errors.firstName ?? errors.lastName}</Text>
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
