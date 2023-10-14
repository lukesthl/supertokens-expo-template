import React, { useState } from "react";
import { Button, Heading, Input, Text, View, XStack, YStack } from "tamagui";
import { AuthStore } from "../../../../../components/auth/auth.store";
import { translate } from "../../../../../components/translate";
import { Stack, router } from "expo-router";
import { Formik } from "formik";
import { AuthError } from "../../../../../components/auth/auth.error";
import { LmButton } from "@tamagui-extras/core";
import {
  DismissKeyboard,
  useSoftKeyboardEffect,
} from "../../../../../components/keyboard";
import { KeyboardAvoidingView } from "react-native";

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
          {({
            values,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <View mt="$8" mx="$4" h="100%">
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
                  <LmButton
                    onPress={() => handleSubmit()}
                    loading={isSubmitting}
                  >
                    {translate.t("auth.resetPassword.sendEmail")}
                  </LmButton>
                  <Button
                    onPress={() => router.back()}
                    color="$gray10"
                    mb="$1"
                    bg="transparent"
                    pressStyle={{
                      bg: "transparent",
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
