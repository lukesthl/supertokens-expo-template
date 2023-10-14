import { LmButton } from "@tamagui-extras/core";
import { LmInput } from "@tamagui-extras/form";
import { StatusBar } from "expo-status-bar";
import { values } from "mobx";
import { Heading, Text, View, YStack } from "tamagui";
import { translate } from "../../../../../components/translate";
import { DismissKeyboard } from "../../../../../components/keyboard";
import { AuthError } from "expo-auth-session";
import { router } from "expo-router";
import { Formik } from "formik";
import { AuthStore } from "../../../../../components/auth/auth.store";
import { useToastController } from "@tamagui/toast";
import { AlertTriangle } from "@tamagui/lucide-icons";

export default function DeleteAccountModal() {
  const toast = useToastController();
  return (
    <>
      <DismissKeyboard>
        <Formik
          initialValues={{ email: "" }}
          validateOnChange={false}
          validateOnBlur={false}
          validate={(values) => {
            const errors: Record<string, string> = {};
            if (!values.email) {
              errors.email = translate.t(
                "account.deleteaccount.errors.email.required"
              );
            } else if (values.email !== AuthStore.user.email) {
              errors.email = translate.t(
                "account.deleteaccount.errors.email.notmatch"
              );
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await AuthStore.deleteAccount();
              toast.show(translate.t("account.deleteaccount.success"), {
                type: "success",
              });
              router.back();
            } catch (error) {
              setErrors({
                email: translate.t("account.deleteaccount.errors.unknown"),
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
            isSubmitting,
          }) => (
            <View mt="$8" space="$3.5" mx="$4">
              <View>
                <Heading>{translate.t("account.deleteaccount.title")}</Heading>
                <Text mt="$1" color="$gray10">
                  {translate.t("account.deleteaccount.description")}
                </Text>
                <Text fontWeight={"bold"} mt="$2">
                  E-Mail: {AuthStore.user.email}
                </Text>
              </View>
              <YStack space="$3">
                <LmInput
                  placeholder={translate.t("account.deleteaccount.email")}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  onSubmitEditing={() => handleSubmit()}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </YStack>
              {errors.email && <Text color="$red10">{errors.email}</Text>}
              <View>
                <LmButton
                  onPress={() => handleSubmit()}
                  loading={isSubmitting}
                  icon={<AlertTriangle />}
                  bg="$red10"
                >
                  {translate.t("account.deleteaccount.submit")}
                </LmButton>
                <LmButton onPress={() => router.back()} mt="$2">
                  {translate.t("account.deleteaccount.cancel")}
                </LmButton>
              </View>
            </View>
          )}
        </Formik>
      </DismissKeyboard>
      <StatusBar style="light" />
    </>
  );
}
