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
import { translate } from "../../../../../components/translate";
import {
  DismissKeyboard,
  useSoftKeyboardEffect,
} from "../../../../../components/keyboard";

const ChangeEmail = observer(() => {
  const toast = useToastController();
  useSoftKeyboardEffect();
  return (
    <>
      <Stack.Screen
        options={{
          title: translate.t("account.changeemail.screenTitle"),
        }}
      />
      <DismissKeyboard>
        <Formik
          initialValues={{ email: "", oldEmail: AuthStore.user.email }}
          validateOnChange={false}
          validateOnBlur={false}
          validate={(values) => {
            const errors: Record<string, string> = {};
            if (!values.email) {
              errors.email = translate.t(
                "account.changeemail.errors.email.required"
              );
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await AuthStore.changeEmail({
                email: values.email,
              });
              toast.show(translate.t("account.changeemail.success"), {
                type: "success",
              });
              router.back();
            } catch (error) {
              if (error instanceof AuthError) {
                if (error.name === "FIELD_ERROR" && error.formFields) {
                  const errors = error.formFields.map((field) => ({
                    [field.id]: field.error,
                  }));
                  setErrors(Object.assign({}, ...errors));
                } else if (error.name === "EMAIL_ALREADY_EXISTS_ERROR") {
                  setErrors({
                    email: translate.t(
                      "account.changeemail.errors.email.alreadyexists"
                    ),
                  });
                } else {
                  setErrors({
                    email: translate.t(
                      "account.changeemail.errors.unkownError"
                    ),
                  });
                }
              } else {
                setErrors({
                  email: translate.t("account.changeemail.errors.unkownError"),
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
                <Text>{translate.t("account.changeemail.subHeadline")}</Text>
                <Heading>{translate.t("account.changeemail.title")}</Heading>
              </View>
              <YStack space="$3">
                <LmInput
                  placeholder={translate.t("account.changeemail.email")}
                  value={values.oldEmail}
                  disabled
                  opacity={0.65}
                  color="$gray10"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <LmInput
                  placeholder={translate.t("account.changeemail.email")}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  onSubmitEditing={() => handleSubmit()}
                  value={values.email}
                  error={!!errors.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </YStack>
              {errors.email && <Text color="$red10">{errors.email}</Text>}
              <View>
                <LmButton onPress={() => handleSubmit()} loading={isSubmitting}>
                  {translate.t("account.changeemail.submit")}
                </LmButton>
              </View>
            </View>
          )}
        </Formik>
      </DismissKeyboard>
    </>
  );
});

export default ChangeEmail;
