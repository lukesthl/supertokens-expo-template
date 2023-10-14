import { LmButton } from "@tamagui-extras/core";
import { LmInput } from "@tamagui-extras/form";
import { useToastController } from "@tamagui/toast";
import { Stack, router } from "expo-router";
import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Heading, Text, View, YStack } from "tamagui";
import { AuthError } from "../../../../../components/auth/auth.error";
import { AuthStore } from "../../../../../components/auth/auth.store";
import {
  DismissKeyboard,
  useSoftKeyboardEffect,
} from "../../../../../components/keyboard";
import { translate } from "../../../../../components/translate";

const ChangePassword = observer(() => {
  const toast = useToastController();
  useSoftKeyboardEffect();
  return (
    <>
      <Stack.Screen
        options={{
          title: translate.t("account.changepassword.screenTitle"),
        }}
      />
      <DismissKeyboard>
        <Formik
          initialValues={{ oldPassword: "", password: "", passwordConfirm: "" }}
          validateOnChange={false}
          validateOnBlur={false}
          validate={(values) => {
            const errors: Record<string, string> = {};
            if (!values.oldPassword) {
              errors.oldPassword = translate.t(
                "account.changepassword.errors.oldpassword.required"
              );
            } else if (!values.password) {
              errors.password = translate.t(
                "account.changepassword.errors.password.required"
              );
            }
            if (values.password !== values.passwordConfirm) {
              errors.password = translate.t(
                "account.changepassword.errors.password.notequals"
              );
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await AuthStore.changePassword({
                oldPassword: values.oldPassword,
                newPassword: values.password,
              });
              toast.show(translate.t("account.changepassword.success"), {
                type: "success",
              });
              router.back();
            } catch (error) {
              if (error instanceof AuthError) {
                if (error?.name === "WRONG_CREDENTIALS_ERROR") {
                  setErrors({
                    oldPassword: translate.t(
                      "account.changepassword.errors.oldpassword.invalid"
                    ),
                  });
                } else if (error.name === "PASSWORD_POLICY_VIOLATED_ERROR") {
                  setErrors({
                    password: translate.t(
                      "account.changepassword.errors.password.passwordStrength"
                    ),
                  });
                } else {
                  setErrors({
                    password: translate.t(
                      "account.changepassword.errors.unkownError"
                    ),
                  });
                }
              } else {
                setErrors({
                  password: translate.t(
                    "account.changepassword.errors.unkownError"
                  ),
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
            isSubmitting,
          }) => (
            <View mt="$8" space="$3.5" mx="$4">
              <View>
                <Text>{translate.t("account.changepassword.subHeadline")}</Text>
                <Heading>{translate.t("account.changepassword.title")}</Heading>
              </View>
              <YStack space="$2">
                <View mb="$2">
                  <LmInput
                    isPassword
                    placeholder={translate.t(
                      "account.changepassword.oldPassword"
                    )}
                    onChangeText={handleChange("oldPassword")}
                    onBlur={handleBlur("oldPassword")}
                    value={values.oldPassword}
                    error={!!errors.oldPassword}
                    passwordIconProps={{ color: "$gray10" }}
                  />
                </View>
                <LmInput
                  isPassword
                  placeholder={translate.t("account.changepassword.password")}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  error={!!errors.password}
                  passwordIconProps={{ color: "$gray10" }}
                />
                <LmInput
                  isPassword
                  onChangeText={handleChange("passwordConfirm")}
                  onBlur={handleBlur("passwordConfirm")}
                  onSubmitEditing={() => handleSubmit()}
                  value={values.passwordConfirm}
                  error={!!errors.passwordConfirm}
                  placeholder={translate.t(
                    "account.changepassword.passwordConfirm"
                  )}
                  passwordIconProps={{ color: "$gray10" }}
                />
              </YStack>
              {(errors.oldPassword ||
                errors.password ||
                errors.passwordConfirm) && (
                <Text color="$red10">
                  {errors.passwordConfirm ||
                    errors.password ||
                    errors.oldPassword}
                </Text>
              )}
              <View>
                <LmButton onPress={() => handleSubmit()} loading={isSubmitting}>
                  {translate.t("account.changepassword.submit")}
                </LmButton>
              </View>
            </View>
          )}
        </Formik>
      </DismissKeyboard>
    </>
  );
});

export default ChangePassword;
