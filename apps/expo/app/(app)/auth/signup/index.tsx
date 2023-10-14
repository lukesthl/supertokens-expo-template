import { LmButton } from "@tamagui-extras/core";
import { LmInput } from "@tamagui-extras/form";
import { Check } from "@tamagui/lucide-icons";
import { Href, Link, Stack, router } from "expo-router";
import { Formik } from "formik";
import React from "react";
import {
  Button,
  Checkbox,
  Heading,
  Input,
  Label,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { AuthError } from "../../../../components/auth/auth.error";
import { AuthStore } from "../../../../components/auth/auth.store";
import { SocialProviders } from "../../../../components/auth/socialproviders";
import { translate } from "../../../../components/translate";
import { useSoftKeyboardEffect } from "../../../../components/keyboard";
import { appConfig } from "../../../../constants/app.config";

export default function SignUp() {
  useSoftKeyboardEffect();
  return (
    <>
      <Stack.Screen
        options={{
          title: translate.t("auth.signUp.screenTitle"),
        }}
      />
      <ScrollView>
        <Formik
          initialValues={{
            email: "",
            password: "",
            passwordConfirm: "",
            firstName: "",
            lastName: "",
            privacyPolicy: false,
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validate={(values) => {
            const errors: Record<string, string | boolean> = {};
            if (!values.email) {
              errors.email = translate.t("auth.signUp.errors.email.required");
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = translate.t("auth.signUp.errors.email.invalid");
            } else if (!values.password || !values.passwordConfirm) {
              errors.password = translate.t(
                "auth.signUp.errors.password.required"
              );
            } else if (!values.firstName) {
              errors.firstName = translate.t(
                "auth.signUp.errors.firstName.required"
              );
            } else if (!values.lastName) {
              errors.lastName = translate.t(
                "auth.signUp.errors.lastName.required"
              );
            } else if (!(values.password === values.passwordConfirm)) {
              errors.password = translate.t(
                "auth.signUp.errors.passwordConfirm.invalid"
              );
            } else if (!values.privacyPolicy) {
              errors.privacyPolicy = translate.t(
                "auth.signUp.errors.privacyPolicy.required"
              );
            }
            console.log(errors);
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await AuthStore.signUp({
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                password: values.password,
              });
              router.push("/auth/email/verify-sent/");
            } catch (error) {
              if (error instanceof AuthError) {
                if (error.name === "FIELD_ERROR" && error.formFields) {
                  const errors = error.formFields.map((field) => ({
                    [field.id]: field.error,
                  }));
                  setErrors(Object.assign({}, ...errors));
                } else {
                  setErrors({
                    email: translate.t("auth.signUp.errors.unkownError"),
                  });
                }
              } else {
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
                <Text>{translate.t("auth.signUp.subHeadline")}</Text>
                <Heading>{translate.t("auth.signUp.title")}</Heading>
              </View>
              <YStack space="$2">
                <XStack space="$2">
                  <Input
                    placeholder={translate.t("auth.signUp.firstName")}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    value={values.firstName}
                    autoCapitalize="words"
                    theme={errors.firstName ? "red" : undefined}
                    borderColor={errors.firstName ? "$red8" : undefined}
                    flex={1}
                  />
                  <Input
                    placeholder={translate.t("auth.signUp.lastName")}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    value={values.lastName}
                    autoCapitalize="words"
                    theme={errors.firstName ? "red" : undefined}
                    borderColor={errors.firstName ? "$red8" : undefined}
                    flex={1}
                  />
                </XStack>
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
                  value={values.password}
                  error={!!errors.password}
                  placeholder={translate.t("auth.login.password")}
                  passwordIconProps={{ color: "$gray10" }}
                />
                <LmInput
                  isPassword
                  onChangeText={handleChange("passwordConfirm")}
                  onBlur={handleBlur("passwordConfirm")}
                  value={values.passwordConfirm}
                  error={!!errors.passwordConfirm}
                  placeholder={translate.t("auth.signUp.passwordConfirm")}
                  passwordIconProps={{ color: "$gray10" }}
                />
              </YStack>
              <YStack space="$2">
                <XStack>
                  <Checkbox
                    size="$4"
                    defaultChecked={values.privacyPolicy}
                    onCheckedChange={(value) => {
                      setFieldValue("privacyPolicy", value);
                    }}
                    id="checkbox-privacypolicy"
                  >
                    <Checkbox.Indicator>
                      <Check />
                    </Checkbox.Indicator>
                  </Checkbox>
                  <Label ml="$2.5" mt="$1" htmlFor="checkbox-privacypolicy">
                    {/* <XStack flexWrap="wrap" space="$1"> */}
                    <View>
                      <Text>
                        {translate.t("auth.signUp.privacyPolicy.0" as any)}
                      </Text>
                      <Link href={appConfig.privacyPolicyUrl as Href<string>}>
                        <Text textDecorationLine="underline">
                          {translate.t("auth.signUp.privacyPolicy.1" as any)}
                        </Text>
                      </Link>
                      <Text>
                        {translate.t("auth.signUp.privacyPolicy.2" as any)}
                      </Text>
                      <Link
                        href={appConfig.termsAndConditionsUrl as Href<string>}
                      >
                        <Text textDecorationLine="underline">
                          {translate.t("auth.signUp.privacyPolicy.3" as any)}
                        </Text>
                      </Link>
                      <Text>
                        {translate.t("auth.signUp.privacyPolicy.4" as any)}
                      </Text>
                    </View>
                    {/* </XStack> */}
                  </Label>
                </XStack>

                <XStack justifyContent={"space-between"} alignItems="center">
                  <Text color="$red10">
                    {errors.firstName ||
                      errors.lastName ||
                      errors.privacyPolicy ||
                      errors.email ||
                      errors.password}
                  </Text>
                </XStack>
              </YStack>
              <View>
                <LmButton onPress={() => handleSubmit()} loading={isSubmitting}>
                  {translate.t("auth.signUp.signUpButton")}
                </LmButton>
                <Button
                  onPress={() => router.back()}
                  bg="transparent"
                  pressStyle={{
                    bg: "transparent",
                    borderWidth: 0,
                  }}
                  color="$gray10"
                  mb="$1"
                >
                  {translate.t("auth.signUp.login")}
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
