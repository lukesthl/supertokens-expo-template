import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LmButton } from "@tamagui-extras/core";
import { LmInput } from "@tamagui-extras/form";
import { AlertTriangle } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { Formik } from "formik";
import { Heading, Text, View, YStack } from "tamagui";

import { AuthStore } from "../../../../../components/auth/auth.store";
import { DismissKeyboard } from "../../../../../components/keyboard";
import { translate } from "../../../../../components/translate";

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
              errors.email = translate.t("account.deleteaccount.errors.email.required");
            } else if (values.email !== AuthStore.user.email) {
              errors.email = translate.t("account.deleteaccount.errors.email.notmatch");
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
          {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <View marginTop="$8" space="$3.5" marginHorizontal="$4">
              <View>
                <Heading>{translate.t("account.deleteaccount.title")}</Heading>
                <Text marginTop="$1" color="$gray10">
                  {translate.t("account.deleteaccount.description")}
                </Text>
                <Text fontWeight={"bold"} marginTop="$2">
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
                  backgroundColor="$red10"
                >
                  {translate.t("account.deleteaccount.submit")}
                </LmButton>
                <LmButton onPress={() => router.back()} marginTop="$2">
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
