import { router, Stack } from "expo-router";
import { LmButton } from "@tamagui-extras/core";
import { Formik } from "formik";
import { Button, Heading, Input, Text, View, YStack } from "tamagui";

import { AuthError } from "../../../../../components/auth/auth.error";
import { AuthStore } from "../../../../../components/auth/auth.store";
import { DismissKeyboard, useSoftKeyboardEffect } from "../../../../../components/keyboard";
import { translate } from "../../../../../components/translate";

export default function ResetPassword() {
  useSoftKeyboardEffect();
  return (
    <>
      <Stack.Screen
        options={{
          title: translate.t("auth.resetPassword.screenTitle"),
        }}
      />
      <DismissKeyboard>
        <Formik
          initialValues={{ email: "" }}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await AuthStore.resetPassword({ email: values.email });
              router.push("/auth/password/reset-sent/");
            } catch (error) {
              if (error instanceof AuthError) {
                if (error.name === "FIELD_ERROR" && error.formFields) {
                  const errors = error.formFields.map((field) => ({
                    [field.id]: field.error,
                  }));
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  setErrors(Object.assign({}, ...errors));
                } else {
                  setErrors({ email: error.message });
                }
              }
              console.log(error);
            }
            setSubmitting(false);
          }}
        >
          {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <View marginTop="$8" marginHorizontal="$4" height="100%">
              <YStack space="$3.5">
                <View>
                  <Text>{translate.t("auth.resetPassword.subHeadline")}</Text>
                  <Heading>{translate.t("auth.resetPassword.title")}</Heading>
                </View>
                <Input
                  placeholder={translate.t("auth.resetPassword.email")}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {errors.email && <Text color="$red10">{errors.email}</Text>}
                <View>
                  <LmButton onPress={() => handleSubmit()} loading={isSubmitting}>
                    {translate.t("auth.resetPassword.sendEmail")}
                  </LmButton>
                  <Button
                    onPress={() => router.back()}
                    color="$gray10"
                    marginBottom="$1"
                    backgroundColor="transparent"
                    pressStyle={{
                      backgroundColor: "transparent",
                      borderWidth: 0,
                    }}
                  >
                    {translate.t("auth.resetPassword.back")}
                  </Button>
                </View>
              </YStack>
            </View>
          )}
        </Formik>
      </DismissKeyboard>
    </>
  );
}
