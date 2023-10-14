import { LmButton } from "@tamagui-extras/core";
import { LmInput } from "@tamagui-extras/form";
import { Href, Link, Stack, router } from "expo-router";
import { Formik } from "formik";
import React from "react";
import {
  Button,
  Heading,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { AuthError } from "../../../../components/auth/auth.error";
import { AuthStore } from "../../../../components/auth/auth.store";
import { SocialProviders } from "../../../../components/auth/socialproviders";
import { useSoftKeyboardEffect } from "../../../../components/keyboard";
import { translate } from "../../../../components/translate";

export default function SignIn() {
  useSoftKeyboardEffect();
  return (
    <>
      <Stack.Screen
        options={{
          title: translate.t("auth.login.screenTitle"),
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      <ScrollView>
        <Formik
          initialValues={{ email: "", password: "" }}
          validateOnChange={false}
          validateOnBlur={false}
          validate={(values) => {
            const errors: Record<string, string> = {};
            if (!values.email) {
              errors.email = translate.t("auth.login.errors.email.required");
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = translate.t("auth.login.errors.email.invalid");
            } else if (!values.password) {
              errors.password = translate.t(
                "auth.login.errors.password.required"
              );
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await AuthStore.signIn({
                email: values.email,
                password: values.password,
              });
              router.push("/(app)/(authorized)/home");
            } catch (error) {
              if (error instanceof AuthError) {
                if (error?.name === "USER_NOT_CONFIRMED_ERROR") {
                  try {
                    await AuthStore.verifyEmail();
                    router.push(
                      ("/auth/email/verify-sent" +
                        `?mail=${values.email}`) as Href<unknown>
                    );
                  } catch (errorTmp) {
                    setErrors({
                      password: translate.t("auth.login.errors.unknown"),
                    });
                    console.log(errorTmp);
                  }
                } else if (error?.name === "WRONG_CREDENTIALS_ERROR") {
                  setErrors({
                    password: translate.t("auth.login.errors.password.invalid"),
                  });
                } else {
                  setErrors({
                    password: translate.t("auth.login.errors.unknown"),
                  });
                }
                console.log(error, error?.name);
              } else {
                setErrors({
                  password: translate.t("auth.login.errors.unknown"),
                });
                console.log(error);
              }
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
                <Text>{translate.t("auth.login.subHeadline")}</Text>
                <Heading>{translate.t("auth.login.title")}</Heading>
              </View>
              <YStack space="$2">
                <LmInput
                  placeholder={translate.t("auth.login.email")}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  error={!!errors.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <LmInput
                  isPassword
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  onSubmitEditing={() => handleSubmit()}
                  value={values.password}
                  error={!!errors.password}
                  placeholder={translate.t("auth.login.password")}
                  passwordIconProps={{ color: "$gray10" }}
                />
              </YStack>
              <YStack space="$2">
                <XStack justifyContent={"space-between"} alignItems="center">
                  <Text color="$red10">{errors.email || errors.password}</Text>
                  <Link href="/auth/password/reset/">
                    <Text color="$gray10">
                      {translate.t("auth.login.forgotPassword")}
                    </Text>
                  </Link>
                </XStack>
              </YStack>
              <View>
                <LmButton onPress={() => handleSubmit()} loading={isSubmitting}>
                  {translate.t("auth.login.loginButton")}
                </LmButton>
                <Button
                  onPress={() => router.push("/auth/signup/")}
                  bg="transparent"
                  pressStyle={{
                    bg: "transparent",
                    borderWidth: 0,
                  }}
                  color="$gray10"
                  mb="$1"
                >
                  {translate.t("auth.login.register")}
                </Button>
              </View>
            </View>
          )}
        </Formik>
        <SocialProviders />
      </ScrollView>
    </>
  );
}
